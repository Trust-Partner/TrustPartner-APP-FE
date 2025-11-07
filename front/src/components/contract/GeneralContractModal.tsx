import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Platform,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../../constants/colors';
import { useContractForm } from '../../hooks/useContractForm';
import CommonInput from '../common/CommonInput';
import { DispatchDetail } from '../../mock/vehicleStatus/vehicleDispatchDetailMock';
import CommonTextarea from '../common/CommonTextarea';
import CommonAmountInput from '../common/CommonAmountInput';
import { launchImageLibrary } from 'react-native-image-picker';
import SignatureScreen from 'react-native-signature-canvas';
import { CONTRACT_FIELD_LABELS } from '../../constants/contractFieldLabels';
import CommonModal from '../common/CommonModal';
import { useContractModalStore } from '../../stores/useContractModalStore';
import { HIT_SLOP } from '../../constants/touch';

interface Props {
  onBack: () => void;
  vehicle: DispatchDetail;
}

export default function GeneralContractModal({ onBack, vehicle }: Props) {
  const requiredFields = ['phone'];

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const initialMissing = requiredFields.filter(k => !formData[k]);
    setMissingFields(initialMissing);
    setIsComplete(initialMissing.length === 0);
  }, []);

  const {
    updateField,
    saveDraftData,
    step,
    nextStep,
    prevStep,
    photos,
    addPhotos,
    replacePhoto,
    removePhoto,
    sigRef,
    signatureStyle,
  } = useContractForm('general', vehicle.id.toString(), updated => {
    setFormData(updated);
    const mf = requiredFields.filter(k => !updated[k] || updated[k] === '');
    setMissingFields(mf);
    setIsComplete(mf.length === 0);
  });

  const [isSigning, setIsSigning] = useState(false);
  const [signatureKey, setSignatureKey] = useState(0);

  const [containerWidth, setContainerWidth] = useState(0);
  const itemSize = (containerWidth - 24) / 3;

  const [sendModalVisible, setSendModalVisible] = useState(false);
  const { closeModal } = useContractModalStore();

  /** 서명 로직 */
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

  /** 갤러리 권한 */
  const requestGalleryPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
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
        return true;
      } catch (err) {
        console.warn('권한 요청 오류:', err);
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

  const handleSendContract = () => {
    // TODO: 실제 전송 로직

    setSendModalVisible(true);
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
      <View style={s.modal}>
        <Pressable onPress={onBack} hitSlop={HIT_SLOP.MEDIUM}>
          <Image
            source={require('../../assets/common/close.png')}
            style={s.close}
          />
        </Pressable>

        <View style={s.headerRow}>
          <Text style={s.title}>일반계약서 작성</Text>
        </View>

        <View style={s.vehicleInfo}>
          <Text style={s.vehicleTag}>{vehicle.model}</Text>
          <Text style={s.vehicleTag}>{vehicle.number}</Text>
        </View>

        <View style={s.stepDots}>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={[s.dot, step === i && s.dotActive]} />
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
              {/* 결제방법 선택 */}
              <View style={s.radioWrap}>
                <View style={s.radioRow}>
                  {['계좌이체', '카드'].map(opt => (
                    <Pressable
                      key={opt}
                      style={s.radioBox}
                      onPress={() => updateField('payment', opt)}
                    >
                      <Text style={s.radioLabel}>{opt}</Text>
                      <View
                        style={[
                          s.radioCircle,
                          formData.payment === opt && s.radioActive,
                        ]}
                      />
                    </Pressable>
                  ))}
                </View>

                <View style={s.radioRow}>
                  {['선불', '후불'].map(opt => (
                    <Pressable
                      key={opt}
                      style={s.radioBox}
                      onPress={() => updateField('payment', opt)}
                    >
                      <Text style={s.radioLabel}>{opt}</Text>
                      <View
                        style={[
                          s.radioCircle,
                          formData.payment === opt && s.radioActive,
                        ]}
                      />
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* 금액 입력 */}
              <CommonAmountInput
                placeholder="금액 입력"
                value={formData.amount}
                onChangeText={v => updateField('amount', v)}
              />

              {/* 기타 메모사항 */}
              <CommonTextarea
                placeholder="기타 메모사항"
                value={formData.memo}
                onChangeText={v => updateField('memo', v)}
              />
            </>
          )}

          {step === 3 && (
            <>
              <View style={s.photoContainer}>
                <View
                  style={s.photoGrid}
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
                            s.photoAddBtn,
                            { width: itemSize, height: itemSize },
                          ]}
                          onPress={handleAddPhoto}
                        >
                          <View style={s.addIconCircle}>
                            <Image
                              source={require('../../assets/common/plus.png')}
                              style={s.addIcon}
                            />
                          </View>
                          <Text style={s.addText}>사진추가</Text>
                        </Pressable>
                      );
                    }
                    return (
                      <Pressable
                        key={i}
                        onPress={() => handleReplacePhoto(i)}
                        style={[
                          s.photoItem,
                          { width: itemSize, height: itemSize },
                        ]}
                      >
                        <Image
                          source={{ uri: item.uri }}
                          style={s.photoThumb}
                          resizeMode="cover"
                        />

                        <Pressable
                          style={s.removeOverlay}
                          onPress={() => removePhoto(i)}
                          hitSlop={HIT_SLOP.COMPACT}
                        >
                          <Image
                            source={require('../../assets/common/close.png')}
                            style={s.removeIcon}
                          />
                        </Pressable>
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={s.subText}>{photos.length}/9장 업로드됨</Text>
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
              <View style={s.signatureBox}>
                <Text style={s.subTitle}>고객 서명란</Text>

                <View style={s.signatureWrapper}>
                  {!isSigning &&
                    (!formData.signature ||
                      formData.signature.length === 0) && (
                      <Text style={s.signaturePlaceholder}>서명해주세요</Text>
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

                <Pressable style={s.clearBtn} onPress={handleClear}>
                  <Text style={s.clearText}>지우기</Text>
                </Pressable>
              </View>
              {!isComplete && (
                <View style={s.missingBox}>
                  <Text style={s.missingTitle}>아래 내용을 입력해주세요</Text>
                  <View style={s.missingList}>
                    {missingFields.map(field => (
                      <View key={field} style={s.missingTag}>
                        <Text style={s.missingTagText}>
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
        <View style={s.footer}>
          {step === 4 && (
            <>
              <Pressable
                style={[s.sendBtn, !isComplete && s.sendBtnDisabled]}
                disabled={!isComplete}
                onPress={handleSendContract}
              >
                <Text
                  style={[
                    s.sendBtnText,
                    !isComplete && { color: colors.GRAY_40 },
                  ]}
                >
                  계약서 카카오톡 전송하기
                </Text>
              </Pressable>
              <View style={s.footerRow}>
                <Pressable
                  style={[s.footerBtn, s.prevBtn, { flex: 1 }]}
                  onPress={prevStep}
                >
                  <Image
                    source={require('../../assets/common/left_arrow.png')}
                    style={s.prevIcon}
                  />
                  <Text style={[s.footerBtnText, s.prevText]}>이전</Text>
                </Pressable>
                <Pressable
                  style={[s.footerBtn, s.draftBtn, { flex: 3 }]}
                  onPress={saveDraftData}
                >
                  <Text style={[s.footerBtnText, s.draftText]}>임시저장</Text>
                </Pressable>
              </View>
            </>
          )}

          {step < 4 && (
            <View style={s.footerRow}>
              {step === 1 ? (
                <>
                  <Pressable
                    style={[s.footerBtn, s.draftBtn, { flex: 3 }]}
                    onPress={saveDraftData}
                  >
                    <Text style={[s.footerBtnText, s.draftText]}>임시저장</Text>
                  </Pressable>

                  <Pressable
                    style={[s.footerBtn, s.nextBtn, { flex: 1 }]}
                    onPress={nextStep}
                  >
                    <Text style={[s.footerBtnText, s.nextText]}>다음</Text>
                    <Image
                      source={require('../../assets/common/right_arrow.png')}
                      style={s.nextIcon}
                    />
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable
                    style={[s.footerBtn, s.prevBtn, { flex: 1 }]}
                    onPress={prevStep}
                  >
                    <Image
                      source={require('../../assets/common/left_arrow.png')}
                      style={s.prevIcon}
                    />
                    <Text style={[s.footerBtnText, s.prevText]}>이전</Text>
                  </Pressable>

                  <Pressable
                    style={[s.footerBtn, s.draftBtn, { flex: 2 }]}
                    onPress={saveDraftData}
                  >
                    <Text style={[s.footerBtnText, s.draftText]}>임시저장</Text>
                  </Pressable>

                  <Pressable
                    style={[s.footerBtn, s.nextBtn, { flex: 1 }]}
                    onPress={nextStep}
                  >
                    <Text style={[s.footerBtnText, s.nextText]}>다음</Text>
                    <Image
                      source={require('../../assets/common/right_arrow.png')}
                      style={s.nextIcon}
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
    </Modal>
  );
}

export const s = StyleSheet.create({
  modal: {
    backgroundColor: colors.WHITE,
    width: '100%',
    borderRadius: 8,
    paddingTop: 8,
    paddingBottom: 32,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  close: {
    alignSelf: 'flex-end',
    width: 16,
    height: 16,
    tintColor: colors.GRAY_60,
  },
  headerRow: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.GRAY_90,
  },
  vehicleInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 8,
  },
  vehicleTag: {
    backgroundColor: colors.PRIMARY_10,
    color: colors.PRIMARY_50,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16.8,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stepDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 10,
    marginVertical: 24,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.GRAY_15,
  },
  dotActive: { backgroundColor: colors.GRAY_80 },
  radioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioWrap: {},
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  radioBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    padding: 8,
    width: '49%',
    backgroundColor: colors.GRAY_05,
  },
  radioLabel: {
    fontSize: 11,
    color: colors.GRAY_80,
  },
  radioCircle: {
    width: 12,
    height: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.GRAY_50,
  },
  radioActive: {
    backgroundColor: colors.PRIMARY_50,
    borderColor: colors.PRIMARY_50,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  amountUnit: {
    fontSize: 14,
    color: colors.GRAY_60,
    marginLeft: 6,
    marginTop: Platform.OS === 'android' ? 2 : 0,
  },
  radioText: { fontSize: 14, color: colors.GRAY_90 },
  photoContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    backgroundColor: colors.GRAY_05,
    padding: 12,
    marginBottom: 8,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    gap: 8,
  },
  photoItem: {
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  photoThumb: {
    width: '100%',
    height: '100%',
  },
  photoAddBtn: {
    borderWidth: 1,
    borderColor: colors.GRAY_20,
    borderRadius: 4,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIconCircle: {
    padding: 4,
    borderRadius: 18,
    backgroundColor: colors.PRIMARY_50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  addIcon: {
    width: 16,
    height: 16,
  },
  addText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_50,
  },
  removeOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.TRANSLUCENT,
    borderRadius: 10,
    padding: 2,
  },
  removeIcon: {
    width: 12,
    height: 12,
    tintColor: colors.WHITE,
  },
  subText: {
    color: colors.GRAY_50,
    fontSize: 11,
    fontWeight: '400',
    marginTop: 12,
    textAlign: 'center',
  },
  signatureBox: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.GRAY_05,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
  },
  subTitle: {
    fontSize: 11,
    color: colors.GRAY_50,
    fontWeight: '600',
    marginBottom: 12,
  },
  clearBtn: {
    alignSelf: 'center',
    marginTop: 12,
  },
  clearText: {
    fontSize: 11,
    color: colors.GRAY_50,
    fontWeight: '400',
  },
  signatureWrapper: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.GRAY_15,
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
    aspectRatio: 2,
    backgroundColor: colors.WHITE,
    position: 'relative',
  },
  signaturePlaceholder: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: colors.GRAY_50,
    fontSize: 11,
    fontWeight: '400',
    zIndex: 1,
  },
  missingBox: {
    marginTop: 24,
    backgroundColor: colors.PRIMARY_00,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.PRIMARY_10,
    padding: 12,
    width: '100%',
  },
  missingTitle: {
    fontSize: 11,
    color: colors.GRAY_50,
    fontWeight: '400',
    marginBottom: 12,
  },
  missingList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  missingTag: {
    backgroundColor: colors.PRIMARY_10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  missingTagText: {
    fontSize: 11,
    color: colors.PRIMARY_50,
    fontWeight: '400',
    lineHeight: 15.4,
  },
  footer: {
    marginTop: 24,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerBtn: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
  },
  draftBtn: {
    borderWidth: 1,
    borderColor: colors.PRIMARY_50,
  },
  prevBtn: {
    flexDirection: 'row',
  },
  nextBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerBtnText: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15.4,
    marginTop: Platform.OS === 'android' ? -1 : 0,
  },
  draftText: {
    color: colors.PRIMARY_50,
  },
  prevText: {
    color: colors.GRAY_90,
  },
  nextText: {
    color: colors.PRIMARY_50,
  },
  prevIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: colors.GRAY_90,
    marginRight: 4,
  },
  nextIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: colors.PRIMARY_50,
    marginLeft: 4,
  },
  sendBtn: {
    backgroundColor: colors.PRIMARY_50,
    borderRadius: 4,
    padding: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  sendBtnDisabled: { backgroundColor: colors.GRAY_15 },
  sendBtnText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.WHITE,
  },
});
