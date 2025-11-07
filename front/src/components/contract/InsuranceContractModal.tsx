import React, { useEffect, useState } from 'react';
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
import { DispatchDetail } from '../../mock/vehicleStatus/vehicleDispatchDetailMock';
import CommonSearchDropdown from '../common/CommonSearchDropdown';
import { s } from './GeneralContractModal';

interface Props {
  onBack: () => void;
  vehicle: DispatchDetail;
}

export default function InsuranceContractModal({ onBack, vehicle }: Props) {
  const requiredFields = ['phone', 'requestCompany', 'garageCompany'];
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
  } = useContractForm('insurance', vehicle.id.toString(), updated => {
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

  /** 서명 처리 */
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

  const handleSendContract = () => setSendModalVisible(true);

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
        <View style={s.modal}>
          <Pressable onPress={onBack} hitSlop={HIT_SLOP.MEDIUM}>
            <Image
              source={require('../../assets/common/close.png')}
              style={s.close}
            />
          </Pressable>

          <View style={s.headerRow}>
            <Text style={s.title}>보험계약서 작성</Text>
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
                  placeholder="* (요청업체)"
                  selectedValue={formData.requestCompany}
                  onSelect={(v, isCustom) =>
                    updateField('requestCompany', isCustom ? `${v} (기타)` : v)
                  }
                  onSearch={async query => {
                    const mock = ['한라렌트카', '한독렌트카', '한양공업사'];
                    return mock.filter(item => item.includes(query));
                  }}
                />
                <CommonSearchDropdown
                  placeholder="* (입고공업사)"
                  selectedValue={formData.garageCompany}
                  onSelect={(v, isCustom) =>
                    updateField('garageCompany', isCustom ? `${v} (기타)` : v)
                  }
                  onSearch={async query => {
                    const mock = ['ESA모터스', '성지공업사', '기아서비스'];
                    return mock.filter(item => item.includes(query));
                  }}
                />
              </>
            )}

            {step === 3 && (
              <>
                <View style={s.photoContainer}>
                  <View
                    style={s.photoGrid}
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
                      ) : (
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
                      ),
                    )}
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

          <View style={s.footer}>
            {step === 4 ? (
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
                    보험계약서 카카오톡 전송하기
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
            ) : (
              <View style={s.footerRow}>
                {step === 1 ? (
                  <>
                    <Pressable
                      style={[s.footerBtn, s.draftBtn, { flex: 3 }]}
                      onPress={saveDraftData}
                    >
                      <Text style={[s.footerBtnText, s.draftText]}>
                        임시저장
                      </Text>
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
                      <Text style={[s.footerBtnText, s.draftText]}>
                        임시저장
                      </Text>
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

import { s as generalStyles } from './GeneralContractModal';
import { HIT_SLOP } from '../../constants/touch';
export { generalStyles };
