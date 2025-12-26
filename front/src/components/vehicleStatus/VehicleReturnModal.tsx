import React, { useState } from 'react';
import { View, Text, Pressable, Image, Alert, Keyboard } from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../../constants/colors';
import CommonDropdown from '../common/CommonDropdown';
import CommonModal from '../common/CommonModal';
import { HIT_SLOP } from '../../constants/touch';
import { modalLayoutStyles as ms } from '../styles/modalLayoutStyles';
import { DispatchDetail } from '../../types/dispatch';
import { useReturnCar } from '../../hooks/vehicleStatus/useReturnCar';
import { useParkingLocations } from '../../hooks/location/useParkingLocations';

interface Props {
  visible: boolean;
  onClose: (status?: 'returned') => void;
  vehicle: DispatchDetail;
}

export default function VehicleReturnModal({
  visible,
  onClose,
  vehicle,
}: Props) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const { data: locations = [] } = useParkingLocations();
  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const { mutateAsync: returnCarMutate, isPending } = useReturnCar();

  const buildReturnPayload = () => ({
    carId: vehicle.id,
    locationId: selectedLocation!.id,
    needsWash: !!formData.needWash,
    needsFuel: !!formData.fuelLack,
  });

  const handleSubmit = () => {
    if (!selectedLocation) return;

    returnCarMutate(buildReturnPayload(), {
      onSuccess: () => {
        setConfirmVisible(true);
      },
      onError: () => {
        Alert.alert('오류', '차량 반납에 실패했습니다.');
      },
    });
  };

  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.5}
      animationIn="fadeIn"
      animationOut="fadeOut"
      statusBarTranslucent
      avoidKeyboard
      onBackdropPress={isPending ? undefined : onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Pressable onPress={Keyboard.dismiss}>
          <View style={ms.modal}>
            {/* 닫기 버튼 */}
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

            {/* 헤더 */}
            <View style={ms.headerRow}>
              <Text style={ms.title}>반납하기</Text>
            </View>

            {/* 차량 정보 */}
            <View style={ms.vehicleInfo}>
              <Text style={ms.vehicleTag}>{vehicle.model}</Text>
              <Text style={ms.vehicleTag}>{vehicle.number}</Text>
            </View>

            {/* 단계표시 점 1개만 */}
            <View style={ms.stepDots}>
              <View style={[ms.dot, ms.dotActive]} />
            </View>

            {/* 위치 드롭다운 */}
            <CommonDropdown
              placeholder="위치를 선택하세요"
              options={locations.map(l => l.locationName)}
              selectedValue={selectedLocation?.name}
              onSelect={name => {
                const found = locations.find(l => l.locationName === name);
                if (!found) return;

                setSelectedLocation({
                  id: found.locationId,
                  name: found.locationName,
                });
              }}
            />

            {/* 연료부족 / 세차필요 */}
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
                    <Text style={{ fontSize: 11, color: colors.GRAY_80 }}>
                      {opt.label}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.GRAY_40 }}>
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
                      ...(checked && { backgroundColor: colors.PRIMARY_50 }),
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

            {/* 푸터 버튼 */}
            <View style={[ms.footerRow, { marginTop: 16 }]}>
              <Pressable
                style={[ms.footerBtn, ms.draftBtn, { marginRight: 8 }]}
                onPress={() => onClose?.()}
              >
                <Text style={[ms.footerBtnText, ms.draftText]}>취소</Text>
              </Pressable>

              <Pressable
                disabled={!selectedLocation || isPending}
                style={[
                  ms.footerBtn,
                  {
                    backgroundColor:
                      !selectedLocation || isPending
                        ? colors.GRAY_15
                        : colors.PRIMARY_50,
                  },
                ]}
                onPress={handleSubmit}
              >
                <Text style={[ms.footerBtnText, { color: colors.WHITE }]}>
                  확인
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>

        {/* 완료 모달 */}
        <CommonModal
          visible={confirmVisible}
          title="반납하기"
          message="차량 반납이 완료되었습니다."
          confirmText="확인"
          hideCancel
          onConfirm={() => {
            setConfirmVisible(false);
            onClose('returned');
          }}
          onCancel={() => setConfirmVisible(false)}
        />
      </View>
    </Modal>
  );
}
