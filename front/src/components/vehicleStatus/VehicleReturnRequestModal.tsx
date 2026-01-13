import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Image, Keyboard, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../../constants/colors';
import { modalLayoutStyles as ms } from '../styles/modalLayoutStyles';
import CommonDropdown from '../common/CommonDropdown';
import CommonModal from '../common/CommonModal';
import { HIT_SLOP } from '../../constants/touch';
import { Vehicle } from '../../screens/user/tab/VehicleStatusScreen';
import { requestPartnerReturn } from '../../api/vehicleStatus';

interface Props {
  visible: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  staffId: number;
  onSubmitSuccess?: () => void;
}

export default function VehicleReturnRequestModal({
  visible,
  onClose,
  vehicle,
  staffId,
  onSubmitSuccess,
}: Props) {
  const [location, setLocation] = useState<string | null>(null);
  const [immediate, setImmediate] = useState<string | null>(null);
  const [doneModal, setDoneModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLocation(null);
    setImmediate(null);
    setError(null);
  }, [vehicle?.id]);

  /** 버튼 비활성화 조건 */
  const isSubmitDisabled =
    !location || (location === '공업사에 있어요' && !immediate) || isLoading;

  /** 서버 전송 */
  const handleSubmit = async () => {
    if (!location) return;

    // locationAnswer 매핑
    const locationAnswer =
      location === '공업사에 있어요'
        ? ('AT_PARTNER_LOCATION' as const)
        : ('CALL_TO_CUSTOMER' as const);

    // whenToReturn 매핑
    let whenToReturn: 'IMMEDIATELY' | 'BY_TODAY';
    if (location === '공업사에 있어요') {
      whenToReturn =
        immediate === '네, 즉시 회수해주세요'
          ? ('IMMEDIATELY' as const)
          : ('BY_TODAY' as const);
    } else {
      // 고객에게 연락해야 하는 경우 기본값으로 BY_TODAY 설정
      whenToReturn = 'BY_TODAY' as const;
    }

    setIsLoading(true);
    setError(null);

    try {
      await requestPartnerReturn(vehicle.id, {
        locationAnswer,
        whenToReturn,
      });
      setDoneModal(true);
    } catch (err: any) {
      console.warn('반납신청 오류:', err);
      setError(
        err?.response?.data?.message || '반납신청 중 오류가 발생했습니다.',
      );
    } finally {
      setIsLoading(false);
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
              <Text style={ms.title}>반납 신청</Text>
            </View>

            {/* 차량 정보 */}
            <View style={ms.vehicleInfo}>
              <Text style={ms.vehicleTag}>{vehicle.name}</Text>
              <Text style={ms.vehicleTag}>{vehicle.plateNumber}</Text>
            </View>

            {/* 차량 위치 */}
            <View style={{ marginTop: 24 }} />
            <Text style={ms.radioLabel}>차량 위치</Text>

            <View style={{ marginTop: 8 }} />
            <CommonDropdown
              placeholder="차량이 어디에 있나요?"
              options={['공업사에 있어요', '고객에게 연락해봐야 해요']}
              selectedValue={location}
              onSelect={v => {
                setLocation(v);
                setImmediate(null); // 공업사 → 즉시 여부 초기화
              }}
            />

            {/* 즉시 회수 여부 (공업사일 때만 표시) */}
            {location === '공업사에 있어요' && (
              <>
                <View style={{ marginTop: 16 }} />
                <Text style={ms.radioLabel}>회수 시점</Text>
                <View style={{ marginTop: 8 }} />
                <CommonDropdown
                  placeholder="지금 즉시 회수해야 하나요?"
                  options={['네, 즉시 회수해주세요', '오늘내로 회수해주세요']}
                  selectedValue={immediate}
                  onSelect={setImmediate}
                />
              </>
            )}

            {/* 에러 메시지 */}
            {error && (
              <>
                <View style={{ marginTop: 16 }} />
                <Text style={{ color: colors.RED_50, fontSize: 18 }}>
                  {error}
                </Text>
              </>
            )}

            {/* 버튼 */}
            <View style={[ms.footerRow, { marginTop: 16, gap: 8 }]}>
              {/* 취소 */}
              <Pressable style={[ms.footerBtn, ms.draftBtn]} onPress={onClose}>
                <Text style={[ms.footerBtnText, ms.nextText]}>취소</Text>
              </Pressable>

              {/* 반납 신청 */}
              <Pressable
                style={[
                  ms.footerBtn,
                  {
                    backgroundColor: isSubmitDisabled
                      ? colors.GRAY_15
                      : colors.PRIMARY_50,
                  },
                ]}
                disabled={isSubmitDisabled}
                onPress={handleSubmit}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.WHITE} />
                ) : (
                  <Text
                    style={[
                      ms.footerBtnText,
                      {
                        color: colors.WHITE,
                      },
                    ]}
                  >
                    반납 신청
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </Pressable>

        {/* 완료 안내 모달 */}
        <CommonModal
          visible={doneModal}
          title="반납 신청"
          message="반납 신청이 완료되었습니다."
          confirmText="확인"
          hideCancel
          onConfirm={() => {
            setDoneModal(false);
            onClose();
            onSubmitSuccess?.();
          }}
        />
      </View>
    </Modal>
  );
}
