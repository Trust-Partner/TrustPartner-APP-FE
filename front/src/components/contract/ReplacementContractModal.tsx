import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  Alert,
  PermissionsAndroid,
  Platform,
  Keyboard,
} from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../../constants/colors';
import { useContractForm } from '../../hooks/useContractForm';
import CommonInput from '../common/CommonInput';
import CommonAmountInput from '../common/CommonAmountInput';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import SignatureScreen from 'react-native-signature-canvas';
import CommonModal from '../common/CommonModal';
import CommonSearchDropdown from '../common/CommonSearchDropdown';
import { useContractModalStore } from '../../stores/useContractModalStore';
import { HIT_SLOP } from '../../constants/touch';
import { modalLayoutStyles as ms } from '../styles/modalLayoutStyles';
import { ContractVehicleBase } from '../../types/contractVehicle';
import { fetchSimplePartners } from '../../api/partners';
import { formatPhoneNumber } from '../../utils/formatPhoneNumber';
import { useSaveReplacementContract } from '../../hooks/contracts/useSaveReplacementContract';

interface Props {
  onBack: () => void;
  vehicle: ContractVehicleBase;
}

export default function ReplacementContractModal({ onBack, vehicle }: Props) {
  if (!vehicle?.contractId) return null;

  const requiredFields = ['phone', 'requestCompanyId', 'garageCompanyId'];

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [sendModalVisible, setSendModalVisible] = useState(false);

  const { closeModal } = useContractModalStore();
  const { mutateAsync: saveContract, isPending } = useSaveReplacementContract();

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
  } = useContractForm('replacement', vehicle.carId.toString(), updated => {
    setFormData(updated);
    const missing = requiredFields.filter(k => !updated[k]);
    setIsComplete(missing.length === 0);
  });

  /* 파트너 검색 */
  const searchPartners = async (query: string) => {
    if (!query.trim()) return [];
    const list = await fetchSimplePartners(query);
    return list.map(p => ({
      label: p.partnerName,
      value: p.partnerId,
    }));
  };

  /* 갤러리 권한 */
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

  const mapAssets = (assets: Asset[]) =>
    assets.filter(a => a.uri).map(a => ({ uri: a.uri! }));

  const buildPayload = () => ({
    customerName: formData.customerName,
    customerPhoneNumber: formData.phone,
    customerAddress: formData.address,

    customerCarType: formData.customerCarModel,
    customerCarNumber: formData.customerCarNumber,
    customerCarDisplacement: formData.customerDisplacement,

    insuranceCompanyName: formData.insuranceCompany,
    insuranceApplicationNumber: formData.reportNumber,

    partnerId: formData.requestCompanyId,
    repairShopId: formData.garageCompanyId,

    fuelQuantity: formData.fuel ? Number(formData.fuel) : undefined,

    isDraft: false,
  });

  const handleSendContract = async () => {
    try {
      await saveContract({
        contractId: vehicle.contractId!,
        payload: buildPayload(),
        contractPhotos: mapAssets(photos),
        signaturePhoto: formData.signature
          ? { uri: formData.signature }
          : undefined,
      });

      setSendModalVisible(true);
    } catch {
      Alert.alert('전송 실패', '교체계약서 전송 중 오류가 발생했습니다.');
    }
  };

  const [isSigning, setIsSigning] = useState(false);
  const [signatureKey, setSignatureKey] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const itemSize = (containerWidth - 24) / 3;

  const handleSignature = (signature: string) => {
    updateField('signature', signature);
    setSignatureKey(prev => prev + 1);
  };

  const handleClear = () => {
    updateField('signature', '');
    sigRef.current?.clearSignature?.();
    setSignatureKey(prev => prev + 1);
  };

  return (
    <Modal
      isVisible
      backdropOpacity={0.5}
      animationIn="fadeIn"
      animationOut="fadeOut"
      statusBarTranslucent
      avoidKeyboard
      onBackdropPress={onBack}
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Pressable onPress={Keyboard.dismiss}>
          <View style={ms.modal}>
            <Pressable
              onPress={onBack}
              hitSlop={HIT_SLOP.MEDIUM}
              style={ms.closeBtn}
            >
              <Image
                source={require('../../assets/common/close.png')}
                style={ms.closeIcon}
              />
            </Pressable>

            <View style={ms.headerRow}>
              <Text style={ms.title}>교체계약서 작성</Text>
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

            {step === 1 && (
              <>
                <CommonInput
                  placeholder="고객 성함"
                  value={formData.customerName}
                  onChangeText={v => updateField('customerName', v)}
                />
                <CommonInput
                  placeholder="* 고객 연락처"
                  value={formatPhoneNumber(formData.phone)}
                  keyboardType="number-pad"
                  onChangeText={v => {
                    const raw = v.replace(/\D/g, '');
                    updateField('phone', raw);
                  }}
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
                  value={formData.customerCarModel}
                  onChangeText={v => updateField('customerCarModel', v)}
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
                  value={formData.reportNumber}
                  onChangeText={v => updateField('reportNumber', v)}
                />
                <CommonSearchDropdown
                  placeholder="* (요청업체)"
                  selectedValue={formData.requestCompanyName}
                  onSearch={searchPartners}
                  onSelect={(item, isCustom) => {
                    updateField('requestCompanyName', item.label);
                    updateField('requestCompanyId', item.value);
                  }}
                />

                <CommonSearchDropdown
                  placeholder="* (입고공업사)"
                  selectedValue={formData.garageCompanyName}
                  onSearch={searchPartners}
                  onSelect={(item, isCustom) => {
                    updateField('garageCompanyName', item.label);
                    updateField('garageCompanyId', item.value);
                  }}
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
                          hitSlop={HIT_SLOP.COMPACT}
                        >
                          <Image
                            source={{ uri: item.uri }}
                            style={ms.photoThumb}
                            resizeMode="cover"
                          />
                          <Pressable
                            style={ms.removeOverlay}
                            onPress={() => removePhoto(i)}
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
              </>
            )}

            <View style={ms.footer}>
              {step === 4 ? (
                <>
                  <Pressable
                    style={[ms.sendBtn, !isComplete && ms.sendBtnDisabled]}
                    disabled={!isComplete || isPending}
                    onPress={handleSendContract}
                  >
                    <Text
                      style={[
                        ms.sendBtnText,
                        !isComplete && { color: colors.GRAY_40 },
                      ]}
                    >
                      교체계약서 카카오톡 전송하기
                    </Text>
                  </Pressable>
                  <View style={ms.footerRow}>
                    <Pressable
                      style={[ms.footerBtn, ms.prevBtn, { flex: 1 }]}
                      onPress={prevStep}
                    >
                      <Image
                        source={require('../../assets/common/left_arrow.png')}
                        style={ms.prevIcon}
                      />
                      <Text style={[ms.footerBtnText, ms.prevText]}>이전</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <View style={[ms.footerRow, { justifyContent: 'flex-end' }]}>
                  {step > 1 && (
                    <Pressable
                      style={[ms.footerBtn, ms.prevBtn, { flex: 1 }]}
                      onPress={prevStep}
                    >
                      <Image
                        source={require('../../assets/common/left_arrow.png')}
                        style={ms.prevIcon}
                      />
                      <Text style={[ms.footerBtnText, ms.prevText]}>이전</Text>
                    </Pressable>
                  )}
                  <Pressable
                    style={[ms.footerBtn, ms.nextBtn]}
                    onPress={nextStep}
                  >
                    <Text style={[ms.footerBtnText, ms.nextText]}>다음</Text>
                    <Image
                      source={require('../../assets/common/right_arrow.png')}
                      style={ms.nextIcon}
                    />
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </Pressable>

        <CommonModal
          visible={sendModalVisible}
          title="교체계약서 작성"
          message="교체계약서를 카카오톡으로 전송하였습니다"
          confirmText="확인"
          hideCancel
          onConfirm={() => {
            setSendModalVisible(false);
            closeModal();
          }}
        />
      </View>
    </Modal>
  );
}
