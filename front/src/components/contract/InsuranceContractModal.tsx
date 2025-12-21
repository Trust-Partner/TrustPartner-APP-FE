import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../../constants/colors';
import { useContractForm } from '../../hooks/useContractForm';
import CommonInput from '../common/CommonInput';
import CommonAmountInput from '../common/CommonAmountInput';
import { launchImageLibrary } from 'react-native-image-picker';
import SignatureScreen from 'react-native-signature-canvas';
import CommonModal from '../common/CommonModal';
import { CONTRACT_FIELD_LABELS } from '../../constants/contractFieldLabels';
import { useContractModalStore } from '../../stores/useContractModalStore';
import CommonSearchDropdown, {
  CommonSearchDropdownRef,
} from '../common/CommonSearchDropdown';
import { HIT_SLOP } from '../../constants/touch';
import { modalLayoutStyles as ms } from '../styles/modalLayoutStyles';
import { ContractVehicleBase } from '../../types/contractVehicle';
import { fetchSimplePartners } from '../../api/partners';
import { useCreateContract } from '../../hooks/contracts/useCreateContract';
import {
  fetchContractUploadUrls,
  saveInsuranceContract,
} from '../../api/contract';
import { uploadToS3 } from '../../utils/uploadToS3';
import { base64ToFile } from '../../utils/base64ToFile';

interface Props {
  onBack: () => void;
  vehicle: ContractVehicleBase;
}

export default function InsuranceContractModal({ onBack, vehicle }: Props) {
  const { getDispatchId, closeModal } = useContractModalStore();
  const dispatchId = getDispatchId(vehicle.id);

  /** ================= contractId ================= */
  const contractIdRef = useRef<number | null>(null);
  const { mutateAsync: createContract } = useCreateContract();

  const ensureContractId = async () => {
    console.log('[ensureContractId] enter');

    if (contractIdRef.current) {
      console.log('[ensureContractId] reuse:', contractIdRef.current);
      return contractIdRef.current;
    }

    console.log('[ensureContractId] before createContract');

    const res = await createContract({
      carDispatchId: dispatchId ?? null,
      contractType: 'INSURANCE_CONTRACT',
    });

    const contractId = res.contractId ?? res.generalContractId;
    // res.insuranceContractId;

    console.log('[ensureContractId] resolved contractId:', contractId);

    if (!contractId) {
      throw new Error('contractId is undefined');
    }

    contractIdRef.current = contractId;
    return contractId;
  };

  /** ================= form ================= */
  const requiredFields = ['phone', 'requestCompany', 'repairShop'];
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const {
    updateField,
    step,
    nextStep,
    prevStep,
    photos,
    addPhotos,
    replacePhoto,
    removePhoto,
    sigRef,
    signatureStyle,
  } = useContractForm('insurance', vehicle.id.toString(), updated => {
    setFormData(updated);
    const mf = requiredFields.filter(k => !updated[k]);
    setMissingFields(mf);
    setIsComplete(mf.length === 0);
  });

  /** ================= 사진 UI ================= */
  const [containerWidth, setContainerWidth] = useState(0);
  const itemSize = (containerWidth - 24) / 3;

  /** ================= 서명 ================= */
  const [isSigning, setIsSigning] = useState(false);
  const [signatureKey, setSignatureKey] = useState(0);

  const handleSignature = (signature: string) => {
    updateField('signature', signature);
    setSignatureKey(p => p + 1);
  };

  const handleClear = () => {
    updateField('signature', '');
    sigRef.current?.clearSignature?.();
    setSignatureKey(p => p + 1);
  };

  /** ================= 업로드 ================= */
  const uploadFiles = async (contractId: number) => {
    const uploadUrls = await fetchContractUploadUrls(contractId);

    const photoKeys: string[] = [];
    let uploadIndex = 0;

    for (const photo of photos) {
      if (photo.source === 'remote') {
        photoKeys.push(photo.key);
        continue;
      }

      const uploadInfo = uploadUrls.contractPhotos[uploadIndex];
      if (!uploadInfo || !photo.asset.uri) break;

      await uploadToS3(uploadInfo.uploadUrl, {
        uri: photo.asset.uri,
        type: photo.asset.type ?? 'image/jpeg',
      });

      photoKeys.push(uploadInfo.fileKey);
      uploadIndex++;
    }

    let signatureKey = '';
    if (formData.signature && uploadUrls.signaturePhoto) {
      const file = base64ToFile(formData.signature, 'signature.png');
      await uploadToS3(uploadUrls.signaturePhoto.uploadUrl, file);
      signatureKey = uploadUrls.signaturePhoto.fileKey;
    }

    return { photoKeys, signatureKey };
  };

  /** ================= 저장 ================= */
  const saveFlow = async (isDraft: boolean) => {
    const contractId = await ensureContractId();
    console.log('[saveFlow] contractId:', contractId);
    const { photoKeys, signatureKey } = await uploadFiles(contractId);
    console.log('[saveFlow] upload done', { photoKeys, signatureKey });

    await saveInsuranceContract(contractId, {
      customerName: formData.customerName ?? '',
      customerPhoneNumber: formData.phone ?? '',
      customerAddress: formData.address ?? '',
      customerCarType: formData.customerCarType ?? '',
      customerCarNumber: formData.customerCarNumber ?? '',
      customerCarDisplacement: formData.customerDisplacement ?? '',
      insuranceCompanyName: formData.insuranceCompany ?? '',
      insuranceApplicationNumber: formData.claimNumber ?? '',
      partnerId: formData.requestCompanyId ?? '',
      repairShopId: formData.repairShopId ?? '',
      contractPhotoKeys: photoKeys,
      customerSignatureKey: signatureKey,
      fuelQuantity: formData.fuel ? Number(formData.fuel) : undefined,
      isDraft,
    });

    console.log('[saveFlow] saveInsuranceContract success');
  };

  const handleSaveDraft = async () => {
    try {
      commitAllDropdowns();
      await saveFlow(true);
      Alert.alert('임시저장 완료');
    } catch {
      Alert.alert('임시저장 실패');
    }
  };

  const [sendModalVisible, setSendModalVisible] = useState(false);

  const handleSendContract = async () => {
    try {
      commitAllDropdowns();
      await saveFlow(false);
      setSendModalVisible(true);
    } catch {
      Alert.alert('전송 실패');
    }
  };

  /** ================= 갤러리 ================= */
  const requestGalleryPermission = async () => {
    if (Platform.OS !== 'android') return true;
    const permission =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    const granted = await PermissionsAndroid.request(permission);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const handleAddPhoto = async () => {
    if (!(await requestGalleryPermission())) return;
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 9 - photos.length },
      res => res.assets && addPhotos(res.assets),
    );
  };

  const handleReplacePhoto = async (i: number) => {
    if (!(await requestGalleryPermission())) return;
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, res => {
      if (res.assets?.[0]) replacePhoto(i, res.assets[0]);
    });
  };

  /** ================= 파트너 ================= */
  const searchPartners = async (q: string) => {
    if (!q.trim()) return [];
    const list = await fetchSimplePartners(q);
    return list.map(p => p.partnerName);
  };

  const requestCompanyRef = useRef<CommonSearchDropdownRef>(null);
  const repairShopRef = useRef<CommonSearchDropdownRef>(null);

  const commitAllDropdowns = () => {
    requestCompanyRef.current?.commit();
    repairShopRef.current?.commit();
  };

  return (
    <Modal
      isVisible
      backdropOpacity={0.5}
      animationIn="fadeIn"
      animationOut="fadeOut"
      statusBarTranslucent
      onBackdropPress={onBack}
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={ms.modal}>
          <Pressable onPress={onBack} hitSlop={HIT_SLOP.MEDIUM}>
            <Image
              source={require('../../assets/common/close.png')}
              style={ms.close}
            />
          </Pressable>

          <View style={ms.headerRow}>
            <Text style={ms.title}>보험계약서 작성</Text>
          </View>

          <View style={ms.vehicleInfo}>
            <Text style={ms.vehicleTag}>{vehicle.model}</Text>
            <Text style={ms.vehicleTag}>{vehicle.number}</Text>
          </View>

          <View style={ms.stepDots}>
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={[ms.dot, step === i && ms.dotActive]} />
            ))}
          </View>

          <View>
            {step === 1 && (
              <>
                <CommonInput
                  placeholder="고객 성함"
                  value={formData.customerName}
                  onChangeText={v => updateField('customerName', v)}
                />
                <CommonInput
                  placeholder="* 고객 연락처"
                  value={formData.phone}
                  onChangeText={v => updateField('phone', v)}
                />
                <CommonInput
                  placeholder="고객 주소"
                  value={formData.address}
                  onChangeText={v => updateField('address', v)}
                />
              </>
            )}

            {step === 2 && (
              <>
                <CommonInput
                  placeholder="고객 차종"
                  value={formData.customerCarType}
                  onChangeText={v => updateField('customerCarType', v)}
                />
                <CommonInput
                  placeholder="고객 차량번호"
                  value={formData.customerCarNumber}
                  onChangeText={v => updateField('customerCarNumber', v)}
                />
                <CommonInput
                  placeholder="고객 배기량"
                  value={formData.customerDisplacement}
                  onChangeText={v => updateField('customerDisplacement', v)}
                />
                <CommonInput
                  placeholder="보험사"
                  value={formData.insuranceCompany}
                  onChangeText={v => updateField('insuranceCompany', v)}
                />
                <CommonInput
                  placeholder="접수번호"
                  value={formData.claimNumber}
                  onChangeText={v => updateField('claimNumber', v)}
                />
                <CommonSearchDropdown
                  ref={requestCompanyRef}
                  placeholder="* (요청업체)"
                  selectedValue={formData.requestCompanyId}
                  onSelect={v => updateField('requestCompany', v)}
                  onSearch={searchPartners}
                />
                <CommonSearchDropdown
                  ref={repairShopRef}
                  placeholder="* (입고공업사)"
                  selectedValue={formData.repairShopId}
                  onSelect={v => updateField('repairShop', v)}
                  onSearch={searchPartners}
                />
              </>
            )}

            {step === 3 && (
              <>
                <View style={ms.photoContainer}>
                  <View
                    style={ms.photoGrid}
                    onLayout={e =>
                      setContainerWidth(e.nativeEvent.layout.width)
                    }
                  >
                    {[
                      ...photos,
                      ...(photos.length < 9 ? [{ isAddButton: true }] : []),
                    ].map((item: any, i) =>
                      item.isAddButton ? (
                        <Pressable
                          key={`add-${i}`}
                          style={[
                            ms.photoAddBtn,
                            { width: itemSize, height: itemSize },
                          ]}
                          onPress={handleAddPhoto}
                        >
                          <View style={ms.addIconCircle}>
                            <Image
                              source={require('../../assets/common/plus.png')}
                              style={ms.addIcon}
                            />
                          </View>
                          <Text style={ms.addText}>사진추가</Text>
                        </Pressable>
                      ) : (
                        <Pressable
                          key={i}
                          onPress={() => handleReplacePhoto(i)}
                          style={[
                            ms.photoItem,
                            { width: itemSize, height: itemSize },
                          ]}
                        >
                          <Image
                            source={{ uri: item.uri }}
                            style={ms.photoThumb}
                            resizeMode="cover"
                          />
                          <Pressable
                            style={ms.removeOverlay}
                            onPress={() => removePhoto(i)}
                            hitSlop={HIT_SLOP.COMPACT}
                          >
                            <Image
                              source={require('../../assets/common/close.png')}
                              style={ms.removeIcon}
                            />
                          </Pressable>
                        </Pressable>
                      ),
                    )}
                  </View>
                  <Text style={ms.subText}>{photos.length}/9장 업로드됨</Text>
                </View>
                <CommonAmountInput
                  placeholder="유류량 입력"
                  value={formData.fuel}
                  onChangeText={v => updateField('fuel', v)}
                  unit="km"
                />
              </>
            )}

            {step === 4 && (
              <>
                <View style={ms.signatureBox}>
                  <Text style={ms.subTitle}>고객 서명란</Text>
                  <View style={ms.signatureWrapper}>
                    {!isSigning &&
                      (!formData.signature ||
                        formData.signature.length === 0) && (
                        <Text style={ms.signaturePlaceholder}>
                          서명해주세요
                        </Text>
                      )}
                    <SignatureScreen
                      key={signatureKey}
                      ref={sigRef}
                      onOK={handleSignature}
                      onEnd={() => {
                        sigRef.current?.readSignature?.();
                        setIsSigning(false);
                      }}
                      onBegin={() => setIsSigning(true)}
                      dataURL={formData.signature}
                      autoClear={false}
                      webStyle={signatureStyle}
                    />
                  </View>
                  <Pressable style={ms.clearBtn} onPress={handleClear}>
                    <Text style={ms.clearText}>지우기</Text>
                  </Pressable>
                </View>

                {!isComplete && (
                  <View style={ms.missingBox}>
                    <Text style={ms.missingTitle}>
                      아래 내용을 입력해주세요
                    </Text>
                    <View style={ms.missingList}>
                      {missingFields.map(field => (
                        <View key={field} style={ms.missingTag}>
                          <Text style={ms.missingTagText}>
                            {CONTRACT_FIELD_LABELS[field] || field}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}
          </View>

          <View style={ms.footer}>
            {step === 4 ? (
              <>
                <Pressable
                  style={[ms.sendBtn, !isComplete && ms.sendBtnDisabled]}
                  disabled={!isComplete}
                  onPress={handleSendContract}
                >
                  <Text
                    style={[
                      ms.sendBtnText,
                      !isComplete && { color: colors.GRAY_40 },
                    ]}
                  >
                    보험계약서 카카오톡 전송하기
                  </Text>
                </Pressable>
                <View style={ms.footerRow}>
                  <Pressable
                    style={[ms.footerBtn, ms.prevBtn, { flex: 1 }]}
                    onPress={() => {
                      commitAllDropdowns();
                      prevStep();
                    }}
                  >
                    <Image
                      source={require('../../assets/common/left_arrow.png')}
                      style={ms.prevIcon}
                    />
                    <Text style={[ms.footerBtnText, ms.prevText]}>이전</Text>
                  </Pressable>
                  <Pressable
                    style={[ms.footerBtn, ms.draftBtn, { flex: 3 }]}
                    onPress={handleSaveDraft}
                  >
                    <Text style={[ms.footerBtnText, ms.draftText]}>
                      임시저장
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <View style={ms.footerRow}>
                {step === 1 ? (
                  <>
                    <Pressable
                      style={[ms.footerBtn, ms.draftBtn, { flex: 3 }]}
                      onPress={() => {
                        console.log('[UI] 임시저장 버튼 클릭');
                        handleSaveDraft();
                      }}
                    >
                      <Text style={[ms.footerBtnText, ms.draftText]}>
                        임시저장
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[ms.footerBtn, ms.nextBtn, { flex: 1 }]}
                      onPress={() => {
                        commitAllDropdowns();
                        nextStep();
                      }}
                    >
                      <Text style={[ms.footerBtnText, ms.nextText]}>다음</Text>
                      <Image
                        source={require('../../assets/common/right_arrow.png')}
                        style={ms.nextIcon}
                      />
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Pressable
                      style={[ms.footerBtn, ms.prevBtn, { flex: 1 }]}
                      onPress={() => {
                        commitAllDropdowns();
                        prevStep();
                      }}
                    >
                      <Image
                        source={require('../../assets/common/left_arrow.png')}
                        style={ms.prevIcon}
                      />
                      <Text style={[ms.footerBtnText, ms.prevText]}>이전</Text>
                    </Pressable>
                    <Pressable
                      style={[ms.footerBtn, ms.draftBtn, { flex: 2 }]}
                      onPress={handleSaveDraft}
                    >
                      <Text style={[ms.footerBtnText, ms.draftText]}>
                        임시저장
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[ms.footerBtn, ms.nextBtn, { flex: 1 }]}
                      onPress={() => {
                        commitAllDropdowns();
                        nextStep();
                      }}
                    >
                      <Text style={[ms.footerBtnText, ms.nextText]}>다음</Text>
                      <Image
                        source={require('../../assets/common/right_arrow.png')}
                        style={ms.nextIcon}
                      />
                    </Pressable>
                  </>
                )}
              </View>
            )}
          </View>
        </View>

        <CommonModal
          visible={sendModalVisible}
          title="보험계약서 작성"
          message="보험계약서를 카카오톡으로 전송하였습니다"
          confirmText="확인"
          hideCancel
          onConfirm={() => {
            setSendModalVisible(false);
            closeModal();
          }}
          onCancel={() => setSendModalVisible(false)}
        />
      </View>
    </Modal>
  );
}
