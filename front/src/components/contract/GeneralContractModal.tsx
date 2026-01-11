import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  Platform,
  Alert,
  PermissionsAndroid,
  Keyboard,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../../constants/colors';
import { useContractForm } from '../../hooks/useContractForm';
import CommonInput from '../common/CommonInput';
import CommonTextarea from '../common/CommonTextarea';
import CommonAmountInput from '../common/CommonAmountInput';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import SignatureScreen from 'react-native-signature-canvas';
import { CONTRACT_FIELD_LABELS } from '../../constants/contractFieldLabels';
import CommonModal from '../common/CommonModal';
import { useContractModalStore } from '../../stores/useContractModalStore';
import { HIT_SLOP } from '../../constants/touch';
import { modalLayoutStyles as ms } from '../styles/modalLayoutStyles';
import { ContractVehicleBase } from '../../types/contractVehicle';
import { useGeneralContractDraft } from '../../hooks/contracts/useGeneralContractDraft';
import { useSaveGeneralContract } from '../../hooks/contracts/useSaveGeneralContract';
import { PaymentMethod, PaymentTime } from '../../api/contracts/contract';

interface Props {
  onBack: () => void;
  vehicle: ContractVehicleBase;
}

const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  ACCOUNT_TRANSFER: '계좌이체',
  CARD: '카드',
};

const PAYMENT_METHODS: PaymentMethod[] = ['ACCOUNT_TRANSFER', 'CARD'];

const PAYMENT_TIME_LABEL: Record<PaymentTime, string> = {
  PREPAID: '선불',
  POSTPAID: '후불',
};

const PAYMENT_TIMES: PaymentTime[] = ['PREPAID', 'POSTPAID'];

export default function GeneralContractModal({ onBack, vehicle }: Props) {
  if (!vehicle) return null;

  /** 필수 입력값 */
  const requiredFields = ['phone'];

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isDraftApplied, setIsDraftApplied] = useState(false);

  /** 계약서 폼 */
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
  } = useContractForm('general', vehicle.carId.toString(), updated => {
    setFormData(updated);
    const mf = requiredFields.filter(k => !updated[k] || updated[k] === '');
    setMissingFields(mf);
    setIsComplete(mf.length === 0);
  });

  /** 임시저장 불러오기 */
  const { data: draft, isLoading: isDraftLoading } = useGeneralContractDraft(
    vehicle.contractId ?? undefined,
  );

  useEffect(() => {
    if (!draft || isDraftApplied) return;

    updateField('customerName', draft.customer?.name);
    updateField('phone', draft.customer?.phone);
    updateField('address', draft.customer?.address);

    updateField('paymentMethod', draft.payment?.method);
    updateField('paymentTime', draft.payment?.time);
    updateField(
      'amount',
      draft.payment?.amount ? String(draft.payment.amount) : undefined,
    );

    updateField('memo', draft.memo);
    updateField(
      'fuel',
      draft.fuelQuantity ? String(draft.fuelQuantity) : undefined,
    );

    setIsDraftApplied(true);
  }, [draft, isDraftApplied, updateField]);

  /** 저장 훅 */
  const { mutateAsync: saveContract, isPending } = useSaveGeneralContract();

  const isDraftFetching =
    !!vehicle.contractId && isDraftLoading && !isDraftApplied;
  const isActionDisabled = isPending || isDraftFetching;

  /** payload builder */
  const buildPayload = (isDraft: boolean) => ({
    customerName: formData.customerName,
    customerPhoneNumber: formData.phone,
    customerAddress: formData.address,

    paymentMethod: formData.paymentMethod,
    paymentTime: formData.paymentTime,
    paymentAmount: formData.amount ? Number(formData.amount) : undefined,

    memo: formData.memo,
    fuelQuantity: formData.fuel ? Number(formData.fuel) : undefined,

    isDraft,
  });

  const mapAssetsToUris = (assets: Asset[]) =>
    assets.filter(a => !!a.uri).map(a => ({ uri: a.uri! }));

  /** 임시저장 */
  const handleSaveDraft = async () => {
    try {
      await saveContract({
        contractId: vehicle.contractId!,
        payload: buildPayload(true),
        contractPhotos: mapAssetsToUris(photos),
        signaturePhoto: formData.signature
          ? { uri: formData.signature }
          : undefined,
      });

      Alert.alert('임시저장 완료', '계약서가 임시저장되었습니다.');
    } catch {
      Alert.alert('저장 실패', '임시저장 중 오류가 발생했습니다.');
    }
  };

  /** 최종 전송 */
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const { closeModal } = useContractModalStore();

  const handleSendContract = async () => {
    try {
      await saveContract({
        contractId: vehicle.contractId!,
        payload: buildPayload(false),
        contractPhotos: mapAssetsToUris(photos),
        signaturePhoto: formData.signature
          ? { uri: formData.signature }
          : undefined,
      });

      setSendModalVisible(true);
    } catch {
      Alert.alert('전송 실패', '계약서 전송 중 오류가 발생했습니다.');
    }
  };

  /** 갤러리 권한 */
  const requestGalleryPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const permission =
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      const granted = await PermissionsAndroid.request(permission);
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          '권한 거부됨',
          '사진을 추가하려면 갤러리 권한이 필요합니다.',
        );
        return false;
      }
    }
    return true;
  };

  const handleAddPhoto = async () => {
    if (!(await requestGalleryPermission())) return;
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 9 - photos.length },
      res => {
        if (res.assets) addPhotos(res.assets);
      },
    );
  };

  const handleReplacePhoto = async (i: number) => {
    if (!(await requestGalleryPermission())) return;
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, res => {
      if (res.assets && res.assets[0]) replacePhoto(i, res.assets[0]);
    });
  };

  /** 서명 */
  const [isSigning, setIsSigning] = useState(false);
  const [signatureKey, setSignatureKey] = useState(0);

  const handleSignature = (signature: string) => {
    if (!signature) return;
    updateField('signature', signature);
    setSignatureKey(prev => prev + 1);
  };

  const handleClear = () => {
    updateField('signature', '');
    sigRef.current?.clearSignature?.();
    setSignatureKey(prev => prev + 1);
  };

  /** 사진 grid */
  const [containerWidth, setContainerWidth] = useState(0);
  const itemSize = (containerWidth - 24) / 3;

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
            {isDraftFetching && (
              <View style={ms.loadingOverlay}>
                <ActivityIndicator size="large" color={colors.PRIMARY_50} />
                <Text style={ms.loadingText}>임시저장 불러오는 중...</Text>
              </View>
            )}

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
              <Text style={ms.title}>일반계약서 작성</Text>
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
                  <View style={ms.radioWrap}>
                    {/* 결제 수단 */}
                    <View style={ms.radioRow}>
                      {PAYMENT_METHODS.map(method => (
                        <Pressable
                          key={method}
                          style={ms.radioBox}
                          onPress={() => updateField('paymentMethod', method)}
                        >
                          <Text style={ms.radioLabel}>
                            {PAYMENT_METHOD_LABEL[method]}
                          </Text>
                          <View
                            style={[
                              ms.radioCircle,
                              formData.paymentMethod === method &&
                                ms.radioActive,
                            ]}
                          />
                        </Pressable>
                      ))}
                    </View>

                    {/* 결제 시점 */}
                    <View style={ms.radioRow}>
                      {PAYMENT_TIMES.map(time => (
                        <Pressable
                          key={time}
                          style={ms.radioBox}
                          onPress={() => updateField('paymentTime', time)}
                        >
                          <Text style={ms.radioLabel}>
                            {PAYMENT_TIME_LABEL[time]}
                          </Text>
                          <View
                            style={[
                              ms.radioCircle,
                              formData.paymentTime === time && ms.radioActive,
                            ]}
                          />
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  <CommonAmountInput
                    placeholder="금액 입력"
                    value={formData.amount}
                    onChangeText={v => updateField('amount', v)}
                  />

                  <CommonTextarea
                    placeholder="기타 메모사항"
                    value={formData.memo}
                    onChangeText={v => updateField('memo', v)}
                  />
                </>
              )}

              {step === 3 && (
                <>
                  <View style={ms.photoContainer}>
                    <View
                      style={ms.photoGrid}
                      onLayout={e => {
                        const { width } = e.nativeEvent.layout;
                        setContainerWidth(width);
                      }}
                    >
                      {[
                        ...photos,
                        ...(photos.length < 9 ? [{ isAddButton: true }] : []),
                      ].map((item: any, i) => {
                        if (item.isAddButton) {
                          return (
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
                          );
                        }
                        return (
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
                        );
                      })}
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
                        onClear={() => {
                          handleClear();
                          setIsSigning(false);
                          setSignatureKey(prev => prev + 1);
                        }}
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

            {/* 하단 */}
            <View style={ms.footer}>
              {step === 4 ? (
                <>
                  <Pressable
                    style={[
                      ms.sendBtn,
                      (!isComplete || isPending) && ms.sendBtnDisabled,
                    ]}
                    disabled={!isComplete || isPending}
                    onPress={handleSendContract}
                  >
                    <View style={ms.buttonContent}>
                      <Text
                        style={[
                          ms.sendBtnText,
                          (!isComplete || isPending) && {
                            color: colors.GRAY_40,
                          },
                          isPending && { opacity: 0 },
                        ]}
                      >
                        계약서 카카오톡 전송하기
                      </Text>

                      {isPending && (
                        <ActivityIndicator
                          size="small"
                          color={colors.WHITE}
                          style={StyleSheet.absoluteFill}
                        />
                      )}
                    </View>
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

                    <Pressable
                      style={[
                        ms.footerBtn,
                        ms.draftBtn,
                        { flex: 3 },
                        isActionDisabled && { opacity: 0.6 },
                      ]}
                      disabled={isActionDisabled}
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
                    style={[
                      ms.footerBtn,
                      ms.draftBtn,
                      { flex: 3 },
                      isActionDisabled && { opacity: 0.6 },
                    ]}
                    disabled={isActionDisabled}
                    onPress={handleSaveDraft}
                  >
                    <Text style={[ms.footerBtnText, ms.draftText]}>
                      임시저장
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[ms.footerBtn, ms.nextBtn, { flex: 1 }]}
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
          title="일반계약서 작성"
          message="일반계약서를 카카오톡으로 전송하였습니다"
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
