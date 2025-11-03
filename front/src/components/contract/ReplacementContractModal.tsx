import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../../constants/colors';
import { useContractForm } from '../../hooks/useContractForm';
import ContractInput from './ContractInput';
import ContractAmountInput from './ContractAmountInput';
import { launchImageLibrary } from 'react-native-image-picker';
import SignatureScreen from 'react-native-signature-canvas';
import CommonModal from '../common/CommonModal';
import ContractSearchDropdown from './ContractSearchDropdown';
import { useContractModalStore } from '../../stores/useContractModalStore';
import { DispatchDetail } from '../../mock/vehicleStatus/vehicleDispatchDetailMock';
import { mockDispatchRequests } from '../../mock/mockDispatchRequests';
import { s } from './GeneralContractModal';

interface Props {
  onBack: () => void;
  vehicle: DispatchDetail;
}

export default function ReplacementContractModal({ onBack, vehicle }: Props) {
  const requiredFields: string[] = [];
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

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
  } = useContractForm('replacement', vehicle.id.toString(), updated => {
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
      } catch {
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

  /** 교체요청건 목록: 배차요청 중 label === '교체건' */
  const replacementRequests = mockDispatchRequests.filter(
    req => req.label === '교체건',
  );

  // 선택된 교체요청건 저장용
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

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
          <TouchableOpacity onPress={onBack}>
            <Image
              source={require('../../assets/common/close.png')}
              style={s.close}
            />
          </TouchableOpacity>

          {step === 1 && !selectedRequest && (
            <>
              <View style={s.headerRow}>
                <Text style={s.title}>교체계약서 요청건 선택</Text>
              </View>

              <View style={s.vehicleInfo}>
                <Text style={s.vehicleTag}>{vehicle.model}</Text>
                <Text style={s.vehicleTag}>{vehicle.year}연식</Text>
                <Text style={s.vehicleTag}>{vehicle.number}</Text>
              </View>

              <View style={{ marginTop: 16 }} />
              {replacementRequests.length === 0 ? (
                <Text
                  style={{
                    fontSize: 13,
                    textAlign: 'center',
                    color: colors.GRAY_50,
                    marginTop: 8,
                  }}
                >
                  교체요청건이 없습니다.
                </Text>
              ) : (
                replacementRequests.map(req => (
                  <TouchableOpacity
                    key={req.id}
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedRequest(req);
                      updateField('selectedDispatch', req);
                      nextStep();
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'stretch',
                      justifyContent: 'space-between',
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: colors.GRAY_10,
                      backgroundColor: colors.WHITE,
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      marginTop: 8,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <View
                        style={{
                          width: 2,
                          height: '100%',
                          backgroundColor: colors.PRIMARY_50,
                          borderRadius: 1,
                          marginRight: 8,
                          alignSelf: 'stretch',
                          marginLeft: -8,
                        }}
                      />

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: -4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: colors.GRAY_60,
                            fontWeight: '500',
                            lineHeight: 16.8,
                            marginRight: 8,
                          }}
                        >
                          {req.company}
                        </Text>
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: colors.GRAY_10,
                            borderRadius: 50,
                            paddingHorizontal: 10,
                            paddingVertical: 2,
                            marginTop: 2,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 11,
                              color: colors.GRAY_60,
                              fontWeight: '400',
                              lineHeight: 15.4,
                            }}
                          >
                            {req.model}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View
                      style={{
                        backgroundColor: colors.YELLOW_00,
                        borderRadius: 10,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        marginTop: -2,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: '400',
                          color: colors.GRAY_60,
                          lineHeight: 15.4,
                        }}
                      >
                        교체건
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </>
          )}

          {step > 1 && (
            <>
              <View style={s.headerRow}>
                <Text style={s.title}>교체계약서 작성</Text>
              </View>

              <View style={s.vehicleInfo}>
                <Text style={s.vehicleTag}>{vehicle.model}</Text>
                <Text style={s.vehicleTag}>{vehicle.number}</Text>
              </View>

              <View style={s.stepDots}>
                {[2, 3, 4, 5].map(i => (
                  <View key={i} style={[s.dot, step === i && s.dotActive]} />
                ))}
              </View>

              {step === 2 && (
                <>
                  <ContractInput
                    placeholder="고객 성함"
                    value={formData.customerName}
                    onChangeText={v => updateField('customerName', v)}
                  />
                  <ContractInput
                    placeholder="* 고객 연락처"
                    value={formData.phone}
                    onChangeText={v => updateField('phone', v)}
                  />
                  <ContractInput
                    placeholder="고객 주소"
                    value={formData.address}
                    onChangeText={v => updateField('address', v)}
                  />
                </>
              )}

              {step === 3 && (
                <>
                  <ContractInput
                    placeholder="고객 차종"
                    value={formData.customerCarModel}
                    onChangeText={v => updateField('customerCarModel', v)}
                  />
                  <ContractInput
                    placeholder="고객 차량번호"
                    value={formData.customerCarNumber}
                    onChangeText={v => updateField('customerCarNumber', v)}
                  />
                  <ContractInput
                    placeholder="고객 배기량"
                    value={formData.customerDisplacement}
                    onChangeText={v => updateField('customerDisplacement', v)}
                  />
                  <ContractInput
                    placeholder="보험사"
                    value={formData.insuranceCompany}
                    onChangeText={v => updateField('insuranceCompany', v)}
                  />
                  <ContractInput
                    placeholder="접수번호"
                    value={formData.reportNumber}
                    onChangeText={v => updateField('reportNumber', v)}
                  />
                  <ContractSearchDropdown
                    placeholder="(요청업체)"
                    selectedValue={formData.requestCompany}
                    onSelect={(v, isCustom) =>
                      updateField(
                        'requestCompany',
                        isCustom ? `${v} (기타)` : v,
                      )
                    }
                    onSearch={async q =>
                      ['한라렌트카', '한독렌트카', '한양공업사'].filter(i =>
                        i.includes(q),
                      )
                    }
                  />
                  <ContractSearchDropdown
                    placeholder="(입고공업사)"
                    selectedValue={formData.garageCompany}
                    onSelect={(v, isCustom) =>
                      updateField('garageCompany', isCustom ? `${v} (기타)` : v)
                    }
                    onSearch={async q =>
                      ['ESA모터스', '성지공업사', '기아서비스'].filter(i =>
                        i.includes(q),
                      )
                    }
                  />
                </>
              )}

              {step === 4 && (
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
                          <TouchableOpacity
                            key={`add-${i}`}
                            style={[
                              s.photoAddBtn,
                              { width: itemSize, height: itemSize },
                            ]}
                            onPress={handleAddPhoto}
                            activeOpacity={0.8}
                          >
                            <View style={s.addIconCircle}>
                              <Image
                                source={require('../../assets/common/plus.png')}
                                style={s.addIcon}
                              />
                            </View>
                            <Text style={s.addText}>사진추가</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
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
                            <TouchableOpacity
                              style={s.removeOverlay}
                              onPress={() => removePhoto(i)}
                            >
                              <Image
                                source={require('../../assets/common/close.png')}
                                style={s.removeIcon}
                              />
                            </TouchableOpacity>
                          </TouchableOpacity>
                        ),
                      )}
                    </View>
                    <Text style={s.subText}>{photos.length}/9장 업로드됨</Text>
                  </View>
                  <ContractAmountInput
                    placeholder="유류량 입력"
                    value={formData.fuel}
                    onChangeText={v => updateField('fuel', v)}
                    unit="km"
                  />
                </>
              )}

              {step === 5 && (
                <>
                  <View style={s.signatureBox}>
                    <Text style={s.subTitle}>고객 서명란</Text>
                    <View style={s.signatureWrapper}>
                      {!isSigning &&
                        (!formData.signature ||
                          formData.signature.length === 0) && (
                          <Text style={s.signaturePlaceholder}>
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
                    <TouchableOpacity style={s.clearBtn} onPress={handleClear}>
                      <Text style={s.clearText}>지우기</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              <View style={s.footer}>
                {step === 5 ? (
                  <>
                    <TouchableOpacity
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
                        교체계약서 카카오톡 전송하기
                      </Text>
                    </TouchableOpacity>
                    <View style={s.footerRow}>
                      <TouchableOpacity
                        style={[s.footerBtn, s.prevBtn, { flex: 1 }]}
                        onPress={prevStep}
                      >
                        <Image
                          source={require('../../assets/common/left_arrow.png')}
                          style={s.prevIcon}
                        />
                        <Text style={[s.footerBtnText, s.prevText]}>이전</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <View style={s.footerRow}>
                    {step > 2 && (
                      <TouchableOpacity
                        style={[s.footerBtn, s.prevBtn, { flex: 1 }]}
                        onPress={prevStep}
                      >
                        <Image
                          source={require('../../assets/common/left_arrow.png')}
                          style={s.prevIcon}
                        />
                        <Text style={[s.footerBtnText, s.prevText]}>이전</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[s.footerBtn, s.nextBtn, { flex: 1 }]}
                      onPress={nextStep}
                    >
                      <Text style={[s.footerBtnText, s.nextText]}>다음</Text>
                      <Image
                        source={require('../../assets/common/right_arrow.png')}
                        style={s.nextIcon}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </>
          )}
        </View>

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
          onCancel={() => setSendModalVisible(false)}
        />
      </View>
    </Modal>
  );
}
