import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  Alert,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import { launchImageLibrary } from 'react-native-image-picker';
import CommonSearchDropdown from '../common/CommonSearchDropdown';
import CommonModal from '../common/CommonModal';
import { colors } from '../../constants/colors';
import CommonDropdown from '../common/CommonDropdown';
import CommonAmountInput from '../common/CommonAmountInput';
import { HIT_SLOP } from '../../constants/touch';
import { modalLayoutStyles as ms } from '../styles/modalLayoutStyles';
import { useParkingLocations } from '../../hooks/location/useParkingLocations';
import { fetchSimplePartners, SimplePartner } from '../../api/partners';
import { useReplaceOrRecall } from '../../hooks/vehicleStatus/useReplaceOrRecall';

interface VehicleItem {
  carId: number;
  name: string;
  plateNumber: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  vehicle: VehicleItem;
  locationId: number;
}

export default function VehicleReplaceModal({
  visible,
  onClose,
  vehicle,
}: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedLocation, setSelectedLocation] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const { data: locations = [] } = useParkingLocations();
  const [partnerOptions, setPartnerOptions] = useState<SimplePartner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const itemSize = (containerWidth - 24) / 3;
  const { mutate: replaceCarMutate, isPending } = useReplaceOrRecall();
  const disabled = !selectedLocation || !selectedPartner || isPending;

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const searchPartners = async (query: string) => {
    if (!query.trim()) {
      setPartnerOptions([]);
      return [];
    }

    try {
      const list = await fetchSimplePartners(query);
      setPartnerOptions(list);
      return list.map(p => p.partnerName);
    } catch (e) {
      console.error('partner search error', e);
      return [];
    }
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

  const handleSubmit = () => {
    if (!selectedLocation || !selectedPartner || isPending) return;

    // 훅에게 payload 정보와 photos 배열을 객체로 전달합니다.
    replaceCarMutate(
      {
        payload: {
          isReplacement: true,
          carId: vehicle.carId,
          locationId: selectedLocation.id,
          partnerId: selectedPartner.id,
          needsWash: !!formData.needWash,
          needsFuel: !!formData.fuelLack,
          fuelLevel: Number(formData.fuel) || 0,
          photoKeys: [], // 훅 내부에서 처리되므로 비워서 보냅니다.
        },
        photos: photos, // 실제 선택된 이미지 객체들이 담긴 배열
      },
      {
        onSuccess: () => setSendModalVisible(true),
        onError: () => Alert.alert('오류', '차량 교체 요청에 실패했습니다.'),
      },
    );
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
        <View style={ms.modal}>
          {/* 닫기 버튼 */}
          <Pressable onPress={onClose} hitSlop={HIT_SLOP.MEDIUM}>
            <Image
              source={require('../../assets/common/close.png')}
              style={ms.close}
            />
          </Pressable>

          {/* 헤더 */}
          <View style={ms.headerRow}>
            <Text style={ms.title}>교체하기</Text>
          </View>

          {/* 차량 정보 */}
          <View style={ms.vehicleInfo}>
            <Text style={ms.vehicleTag}>{vehicle.name}</Text>
            <Text style={ms.vehicleTag}>{vehicle.plateNumber}</Text>
          </View>

          {/* 단계 표시 (2단계만 필요) */}
          <View style={ms.stepDots}>
            {[1, 2].map(i => (
              <View key={i} style={[ms.dot, step === i && ms.dotActive]} />
            ))}
          </View>

          {/* 본문 */}
          <View>
            {step === 1 && (
              <>
                {/* 위치 선택 - 드롭다운 */}
                <CommonDropdown
                  placeholder="위치를 선택하세요"
                  options={locations.map(l => l.locationName)}
                  selectedValue={selectedLocation?.name}
                  onSelect={name => {
                    const found = locations.find(l => l.locationName === name);
                    if (found) {
                      setSelectedLocation({
                        id: found.locationId,
                        name: found.locationName,
                      });
                    }
                  }}
                />

                {/* 요청업체 선택 - 검색형 */}
                <CommonSearchDropdown
                  placeholder="요청업체를 선택하세요"
                  selectedValue={selectedPartner?.name}
                  onSearch={searchPartners}
                  onSelect={(name, isCustom) => {
                    if (isCustom) {
                      setSelectedPartner(null);
                      return;
                    }

                    const found = partnerOptions.find(
                      p => p.partnerName === name,
                    );

                    if (!found) return;

                    setSelectedPartner({
                      id: found.partnerId,
                      name: found.partnerName,
                    });
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
                      <Pressable
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
                      </Pressable>
                    );
                  })}
                </>

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
                  onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
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
              <View style={ms.footerRow}>
                <Pressable
                  style={[ms.footerBtn, ms.nextBtn, { flex: 1 }]}
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
                  disabled={disabled || isPending}
                  style={[
                    ms.footerBtn,
                    {
                      flex: 2,
                      backgroundColor:
                        disabled || isPending
                          ? colors.GRAY_15
                          : colors.PRIMARY_50,
                    },
                  ]}
                  onPress={handleSubmit}
                >
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Text
                      style={[
                        ms.footerBtnText,
                        { color: colors.WHITE },
                        isPending && { opacity: 0 },
                      ]}
                    >
                      완료
                    </Text>

                    {isPending && (
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
