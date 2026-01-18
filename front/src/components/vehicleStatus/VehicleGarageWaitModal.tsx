import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  Alert,
  PermissionsAndroid,
  Platform,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import { launchImageLibrary } from 'react-native-image-picker';
import CommonModal from '../common/CommonModal';
import { colors } from '../../constants/colors';
import CommonDropdown from '../common/CommonDropdown';
import CommonAmountInput from '../common/CommonAmountInput';
import { HIT_SLOP } from '../../constants/touch';
import { modalLayoutStyles as ms } from '../styles/modalLayoutStyles';
import { Vehicle } from '../../screens/user/tab/VehicleStatusScreen';
import { usePartnerWaiting } from '../../hooks/vehicleStatus/usePartnerWaiting';
import { useAuthStore } from '../../states/useAuthStore';

interface Props {
  visible: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  companyName: string;
}

export default function VehicleGarageWaitModal({
  visible,
  onClose,
  vehicle,
  companyName,
}: Props) {
  const user = useAuthStore(s => s.user);
  const partnerWaitingMutation = usePartnerWaiting();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [photos, setPhotos] = useState<any[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const itemSize = (containerWidth - 24) / 3;

  useEffect(() => {
    // 위치 기본값: 해당 공업사 이름
    setFormData(prev => ({ ...prev, location: companyName }));
  }, [companyName]);

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

  const buildPayload = () => {
    if (!user || user.kind !== 'USER' || !user.locationId) {
      throw new Error('USER_LOCATION_ID_NOT_FOUND');
    }

    return {
      locationId: user.locationId,
      needsFuel: !!formData.fuelLack,
      needsWash: !!formData.needWash,
      fuelLevel: formData.fuel ? Math.min(Number(formData.fuel) / 100, 1) : 0,
    };
  };

  const isSubmitting = partnerWaitingMutation.isPending;

  const handleSubmit = () => {
    if (isSubmitting) return;

    try {
      partnerWaitingMutation.mutate(
        {
          carId: vehicle.id,
          payload: buildPayload(),
          photos: photos.map(p => ({ uri: p.uri })),
        },
        {
          onSuccess: () => {
            setSendModalVisible(true);
          },
          onError: err => {
            console.error(err);
            Alert.alert(
              '요청 실패',
              '공업사 대기 요청 중 오류가 발생했습니다.',
            );
          },
        },
      );
    } catch {
      Alert.alert('요청 불가', '사용자 위치 정보를 불러올 수 없습니다.');
    }
  };

  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.5}
      animationIn="fadeIn"
      animationOut="fadeOut"
      statusBarTranslucent
      avoidKeyboard
      onBackdropPress={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Pressable onPress={Keyboard.dismiss}>
          <View style={ms.modal}>
            {/* 닫기 */}
            <Pressable
              onPress={() => onClose()}
              hitSlop={HIT_SLOP.MEDIUM}
              style={ms.closeBtn}
            >
              <Image
                source={require('../../assets/common/close.png')}
                style={ms.closeIcon}
              />
            </Pressable>

            {/* 제목 */}
            <View style={ms.headerRow}>
              <Text style={ms.title}>공업사 대기</Text>
            </View>

            {/* 차량 정보 */}
            <View style={ms.vehicleInfo}>
              <Text style={ms.vehicleTag}>{vehicle.name}</Text>
              <Text style={ms.vehicleTag}>{vehicle.plateNumber}</Text>
            </View>

            {/* 단계 점 */}
            <View style={ms.stepDots}>
              {[1, 2].map(i => (
                <View key={i} style={[ms.dot, step === i && ms.dotActive]} />
              ))}
            </View>

            {/* 본문 */}
            <View>
              {step === 1 && (
                <>
                  {/* 위치 드롭다운 — 수정 불가 */}
                  <CommonDropdown
                    placeholder="위치 선택"
                    options={[companyName]}
                    selectedValue={companyName}
                    onSelect={() => {}}
                    disabled
                  />

                  {/* 체크리스트 */}
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
                      <Pressable
                        key={opt.key}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: colors.PRIMARY_05,
                          borderRadius: 4,
                          padding: 12,
                          marginBottom: 8,
                        }}
                        onPress={() => updateField(opt.key, !checked)}
                      >
                        <View>
                          <Text
                            style={{
                              fontSize: 17,
                              fontWeight: '500',
                              color: colors.GRAY_80,
                            }}
                          >
                            {opt.label}
                          </Text>
                          <Text
                            style={{
                              fontSize: 17,
                              fontWeight: '500',
                              color: colors.GRAY_40,
                            }}
                          >
                            {opt.sub}
                          </Text>
                        </View>
                        <View
                          style={{
                            width: 20,
                            height: 20,
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
                      </Pressable>
                    );
                  })}

                  <CommonAmountInput
                    placeholder="유류량 입력"
                    value={formData.fuel}
                    onChangeText={v => updateField('fuel', v)}
                    unit="km"
                  />
                </>
              )}

              {step === 2 && (
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
                            onPress={() => handleRemovePhoto(i)}
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
              )}
            </View>

            {/* 하단 버튼 */}
            <View style={ms.footer}>
              {step === 1 ? (
                <View style={[ms.footerRow, { justifyContent: 'flex-end' }]}>
                  <Pressable
                    style={[ms.footerBtn, ms.nextBtn, { flex: 0 }]}
                    onPress={() => setStep(2)}
                  >
                    <Text style={[ms.footerBtnText, ms.nextText]}>다음</Text>
                    <Image
                      source={require('../../assets/common/right_arrow.png')}
                      style={ms.nextIcon}
                    />
                  </Pressable>
                </View>
              ) : (
                <View style={ms.footerRow}>
                  <Pressable
                    style={[ms.footerBtn, ms.prevBtn, { flex: 1 }]}
                    onPress={() => setStep(1)}
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
                      { flex: 2, backgroundColor: colors.PRIMARY_50 },
                      isSubmitting && { opacity: 0.7 },
                    ]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                  >
                    <View
                      style={{ alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Text
                        style={[
                          ms.footerBtnText,
                          isSubmitting && { opacity: 0 },
                        ]}
                      >
                        완료
                      </Text>

                      {isSubmitting && (
                        <ActivityIndicator
                          size="small"
                          color={colors.WHITE}
                          style={{ position: 'absolute' }}
                        />
                      )}
                    </View>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </Pressable>

        {/* 완료 안내 모달 */}
        <CommonModal
          visible={sendModalVisible}
          title="공업사 대기"
          message="공업사 대기 요청이 완료되었습니다."
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
