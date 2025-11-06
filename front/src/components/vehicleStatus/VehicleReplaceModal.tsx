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
import { launchImageLibrary } from 'react-native-image-picker';
import { s as baseStyles } from '../contract/GeneralContractModal';
import ContractSearchDropdown from '../contract/ContractSearchDropdown';
import CommonModal from '../common/CommonModal';
import { VehicleCompanyDetail } from '../../mock/vehicleStatus/vehicleCompanyDetailMock';
import { colors } from '../../constants/colors';
import CommonDropdown from '../common/CommonDropdown';
import ContractAmountInput from '../contract/ContractAmountInput';

interface Props {
  visible: boolean;
  onClose: () => void;
  vehicle: VehicleCompanyDetail['vehicles'][number];
}

export default function VehicleReplaceModal({
  visible,
  onClose,
  vehicle,
}: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [photos, setPhotos] = useState<any[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const itemSize = (containerWidth - 24) / 3;

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
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

  /** 사진 추가/교체/삭제 */
  const handleAddPhoto = async () => {
    if (!(await requestGalleryPermission())) return;
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 9 - photos.length },
      res => {
        if (res.assets && res.assets.length > 0) {
          setPhotos(prev => [...prev, ...(res.assets ?? [])]);
        }
      },
    );
  };

  const handleReplacePhoto = async (i: number) => {
    if (!(await requestGalleryPermission())) return;
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, res => {
      if (res.assets && res.assets[0]) {
        const newArr = [...photos];
        newArr[i] = res.assets[0];
        setPhotos(newArr);
      }
    });
  };

  const handleRemovePhoto = (i: number) => {
    setPhotos(prev => prev.filter((_, idx) => idx !== i));
  };

  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.5}
      animationIn="fadeIn"
      animationOut="fadeOut"
      statusBarTranslucent
      onBackdropPress={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={baseStyles.modal}>
          {/* 닫기 버튼 */}
          <TouchableOpacity onPress={onClose}>
            <Image
              source={require('../../assets/common/close.png')}
              style={baseStyles.close}
            />
          </TouchableOpacity>

          {/* 헤더 */}
          <View style={baseStyles.headerRow}>
            <Text style={baseStyles.title}>교체하기</Text>
          </View>

          {/* 차량 정보 */}
          <View style={baseStyles.vehicleInfo}>
            <Text style={baseStyles.vehicleTag}>{vehicle.name}</Text>
            <Text style={baseStyles.vehicleTag}>{vehicle.plateNumber}</Text>
          </View>

          {/* 단계 표시 (2단계만 필요) */}
          <View style={baseStyles.stepDots}>
            {[1, 2].map(i => (
              <View
                key={i}
                style={[baseStyles.dot, step === i && baseStyles.dotActive]}
              />
            ))}
          </View>

          {/* 본문 */}
          <View>
            {step === 1 && (
              <>
                {/* 위치 선택 - 드롭다운 */}
                <CommonDropdown
                  placeholder="위치를 선택하세요"
                  options={['ESA', '렉시온']}
                  selectedValue={formData.location}
                  onSelect={v => updateField('location', v)}
                />

                {/* 요청업체 선택 - 검색형 */}
                <ContractSearchDropdown
                  placeholder="요청업체를 선택하세요"
                  selectedValue={formData.requestCompany}
                  onSelect={(v, isCustom) =>
                    updateField('requestCompany', isCustom ? `${v} (기타)` : v)
                  }
                  onSearch={async query => {
                    const mock = ['한라렌트카', '한독렌트카', '한양공업사'];
                    return mock.filter(item => item.includes(query));
                  }}
                />

                {/* 연료부족 / 세차필요 */}
                <>
                  {[
                    { key: 'fuelLack', label: '연료 부족', sub: '70km 미만' },
                    {
                      key: 'needWash',
                      label: '세차 필요',
                      sub: '다음 배차를 위해 세차를 해야해요',
                    },
                  ].map(opt => {
                    const checked = formData[opt.key];
                    return (
                      <TouchableOpacity
                        key={opt.key}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: colors.PRIMARY_05,
                          borderRadius: 4,
                          padding: 8,
                          marginBottom: 8,
                        }}
                        onPress={() => updateField(opt.key, !formData[opt.key])}
                        activeOpacity={0.8}
                      >
                        <View>
                          <Text
                            style={{
                              fontSize: 11,
                              fontWeight: '400',
                              color: colors.GRAY_80,
                            }}
                          >
                            {opt.label}
                          </Text>
                          <Text
                            style={{
                              fontSize: 11,
                              fontWeight: '400',
                              color: colors.GRAY_40,
                            }}
                          >
                            {opt.sub}
                          </Text>
                        </View>
                        <View
                          style={{
                            width: 16,
                            height: 16,
                            borderWidth: 1,
                            borderColor: colors.PRIMARY_50,

                            borderRadius: 4,
                            alignItems: 'center',
                            justifyContent: 'center',
                            ...(checked && {
                              backgroundColor: colors.PRIMARY_50,
                            }),
                          }}
                        >
                          {checked && (
                            <Image
                              source={require('../../assets/common/check_white.png')}
                              style={{ width: 8, height: 6 }}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </>

                <ContractAmountInput
                  placeholder="유류량 입력"
                  value={formData.fuel}
                  onChangeText={v => updateField('fuel', v)}
                  unit="km"
                />
              </>
            )}

            {step === 2 && (
              <View style={baseStyles.photoContainer}>
                <View
                  style={baseStyles.photoGrid}
                  onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
                >
                  {[
                    ...photos,
                    ...(photos.length < 9 ? [{ isAddButton: true }] : []),
                  ].map((item: any, i) =>
                    item.isAddButton ? (
                      <TouchableOpacity
                        key={`add-${i}`}
                        style={[
                          baseStyles.photoAddBtn,
                          { width: itemSize, height: itemSize },
                        ]}
                        onPress={handleAddPhoto}
                        activeOpacity={0.8}
                      >
                        <View style={baseStyles.addIconCircle}>
                          <Image
                            source={require('../../assets/common/plus.png')}
                            style={baseStyles.addIcon}
                          />
                        </View>
                        <Text style={baseStyles.addText}>사진추가</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        key={i}
                        onPress={() => handleReplacePhoto(i)}
                        style={[
                          baseStyles.photoItem,
                          { width: itemSize, height: itemSize },
                        ]}
                      >
                        <Image
                          source={{ uri: item.uri }}
                          style={baseStyles.photoThumb}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          style={baseStyles.removeOverlay}
                          onPress={() => handleRemovePhoto(i)}
                          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        >
                          <Image
                            source={require('../../assets/common/close.png')}
                            style={baseStyles.removeIcon}
                          />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ),
                  )}
                </View>
                <Text style={baseStyles.subText}>
                  {photos.length}/9장 업로드됨
                </Text>
              </View>
            )}
          </View>

          {/* 하단 버튼 */}
          <View style={baseStyles.footer}>
            {step === 1 ? (
              <View style={baseStyles.footerRow}>
                <TouchableOpacity
                  style={[
                    baseStyles.footerBtn,
                    baseStyles.nextBtn,
                    { flex: 1 },
                  ]}
                  onPress={() => setStep(2)}
                >
                  <Text style={[baseStyles.footerBtnText, baseStyles.nextText]}>
                    다음
                  </Text>
                  <Image
                    source={require('../../assets/common/right_arrow.png')}
                    style={baseStyles.nextIcon}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={baseStyles.footerRow}>
                <TouchableOpacity
                  style={[
                    baseStyles.footerBtn,
                    baseStyles.prevBtn,
                    { flex: 1 },
                  ]}
                  onPress={() => setStep(1)}
                >
                  <Image
                    source={require('../../assets/common/left_arrow.png')}
                    style={baseStyles.prevIcon}
                  />
                  <Text style={[baseStyles.footerBtnText, baseStyles.prevText]}>
                    이전
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    baseStyles.footerBtn,

                    { flex: 2, backgroundColor: colors.PRIMARY_50 },
                  ]}
                  onPress={() => setSendModalVisible(true)}
                >
                  <Text
                    style={[baseStyles.footerBtnText, { color: colors.WHITE }]}
                  >
                    완료
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* 완료 안내 모달 */}
        <CommonModal
          visible={sendModalVisible}
          title="교체하기"
          message="차량 교체 요청이 완료되었습니다."
          confirmText="확인"
          hideCancel
          onConfirm={() => {
            setSendModalVisible(false);
            onClose();
          }}
          onCancel={() => setSendModalVisible(false)}
        />
      </View>
    </Modal>
  );
}
