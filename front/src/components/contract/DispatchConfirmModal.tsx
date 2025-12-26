import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../constants/colors';
import { mockDispatchRequests } from '../../mock/mockDispatchRequests';
import CommonModal from '../common/CommonModal';
import { useContractModalStore } from '../../stores/useContractModalStore';
import CommonTextarea from '../common/CommonTextarea';
import { ContractVehicleBase } from '../../types/contractVehicle';
import { useDispatchList } from '../../hooks/dispatch/useDispatchList';
import { mapDispatchItemToVM } from '../../utils/dispatchRequestMapping';
import { HIT_SLOP } from '../../constants/touch';

interface Props {
  onBack: () => void;
  vehicle: ContractVehicleBase;
}

export default function DispatchConfirmModal({ onBack, vehicle }: Props) {
  const [step, setStep] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [autoSave, setAutoSave] = useState(false);
  const [message, setMessage] = useState('');
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const { closeModal } = useContractModalStore();

  const { data, isLoading } = useDispatchList();
  const dispatchRequests =
    data?.dispatchList
      .filter(item => item.dispatchStatus === 'REQUESTED')
      .map(mapDispatchItemToVM) ?? [];

  useEffect(() => {
    (async () => {
      try {
        const savedAuto = await AsyncStorage.getItem('dispatch_autosave');
        const savedMessage = await AsyncStorage.getItem('dispatch_message');

        if (savedAuto === 'true' && savedMessage) {
          setAutoSave(true);
          setMessage(savedMessage);
        } else {
          // 자동저장이 비활성화되어 있으면 빈값 유지
          setAutoSave(false);
          setMessage('');
        }
      } catch (e) {
        console.warn('자동저장 불러오기 실패:', e);
        setAutoSave(false);
        setMessage('');
      }
    })();
  }, [vehicle.id]);

  const handleConfirm = async () => {
    try {
      if (autoSave) {
        await AsyncStorage.setItem('dispatch_autosave', 'true');
        await AsyncStorage.setItem('dispatch_message', message);
      } else {
        await AsyncStorage.removeItem('dispatch_autosave');
        await AsyncStorage.removeItem('dispatch_message');
      }
      setSendModalVisible(true);
    } catch (e) {
      console.warn('자동저장 처리 실패:', e);
      setSendModalVisible(true);
    }
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
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={s.modal}>
          {/* 닫기 버튼 */}
          <Pressable
            onPress={onBack}
            hitSlop={HIT_SLOP.MEDIUM}
            style={s.closeBtn}
          >
            <Image
              source={require('../../assets/common/close.png')}
              style={s.closeIcon}
            />
          </Pressable>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <View style={s.headerRow}>
                <Text style={s.title}>배차 요청건 선택</Text>
              </View>

              <View style={s.vehicleInfo}>
                <Text style={s.vehicleTag}>{vehicle.model}</Text>
                <Text style={s.vehicleTag}>{vehicle.year}연식</Text>
                <Text style={s.vehicleTag}>{vehicle.number}</Text>
              </View>

              <View style={{ marginTop: 16 }} />
              {dispatchRequests.length === 0 ? (
                <Text style={s.emptyText}>배차 요청건이 없습니다.</Text>
              ) : (
                dispatchRequests.map(req =>
                  req.isReplacement ? (
                    <Pressable
                      key={req.id}
                      onPress={() => {
                        setSelectedRequest(req);
                        setStep(2);
                      }}
                      style={s.replaceRequestCard}
                    >
                      <View style={s.replaceLeft}>
                        <View style={s.replaceLine} />

                        <View style={s.replaceCompanyRow}>
                          <Text style={s.replaceCompanyText}>
                            {req.company}
                          </Text>
                          <View style={s.replaceModelBadge}>
                            <Text style={s.replaceModelText}>{req.model}</Text>
                          </View>
                        </View>
                      </View>

                      <View style={s.replaceBadge}>
                        <Text style={s.replaceBadgeText}>교체건</Text>
                      </View>
                    </Pressable>
                  ) : (
                    <Pressable
                      key={req.id}
                      onPress={() => {
                        setSelectedRequest(req);
                        setStep(2);
                      }}
                      style={s.requestCard}
                    >
                      <View style={s.requestLeft}>
                        <View style={s.leftLine} />
                        <View style={s.companyRow}>
                          <Text style={s.companyText}>{req.company}</Text>
                          <View style={s.badge}>
                            <Text style={s.badgeText}>{req.model}</Text>
                            <Text style={s.badgeText}>{req.year}</Text>
                            <Text style={s.badgeText}>{req.displacement}</Text>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  ),
                )
              )}
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && selectedRequest && (
            <>
              <View style={s.headerRow}>
                <Text style={s.title}>배차 확정</Text>
              </View>

              {/* 전달받은 vehicle 정보 유지 */}
              <View style={s.vehicleInfo}>
                <Text style={s.vehicleTag}>{vehicle.model}</Text>
                <Text style={s.vehicleTag}>{vehicle.year}연식</Text>
                <Text style={s.vehicleTag}>{vehicle.number}</Text>
              </View>

              <Text style={s.subTitle}>요청업체에 전송할 메세지</Text>
              <CommonTextarea
                value={message}
                onChangeText={setMessage}
                placeholder="메세지를 입력해주세요"
                heightScale={0.1}
              />

              <Pressable
                style={s.checkboxRow}
                onPress={() => setAutoSave(!autoSave)}
              >
                <View style={[s.checkbox, autoSave && s.checked]}>
                  {autoSave && (
                    <Image
                      source={require('../../assets/common/check_white.png')}
                      style={{ width: 8, height: 6 }}
                    />
                  )}
                </View>
                <Text style={s.checkboxLabel}>자동 저장</Text>
              </Pressable>

              <View style={s.footer}>
                <Pressable style={s.sendBtn} onPress={handleConfirm}>
                  <Text style={s.sendBtnText}>배차 확정</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>

        {/* 완료 모달 */}
        <CommonModal
          visible={sendModalVisible}
          title="배차 확정"
          message="배차가 확정되었습니다"
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

const s = StyleSheet.create({
  modal: {
    backgroundColor: colors.WHITE,
    width: '100%',
    borderRadius: 8,
    paddingTop: 8,
    paddingBottom: 32,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    width: 16,
    height: 16,
    justifyContent: 'center',
    resizeMode: 'contain',
    marginRight: -8,
  },
  closeIcon: {
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
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    color: colors.GRAY_50,
    marginTop: 8,
  },
  replaceRequestCard: {
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
  },
  replaceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replaceLine: {
    width: 2,
    height: '100%',
    backgroundColor: colors.PRIMARY_50,
    borderRadius: 1,
    marginRight: 8,
    alignSelf: 'stretch',
    marginLeft: -8,
  },
  replaceCompanyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -4,
  },
  replaceCompanyText: {
    fontSize: 12,
    color: colors.GRAY_60,
    fontWeight: '500',
    lineHeight: 16.8,
    marginRight: 8,
  },
  replaceModelBadge: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: 2,
  },
  replaceModelText: {
    fontSize: 11,
    color: colors.GRAY_60,
    fontWeight: '400',
    lineHeight: 15.4,
  },
  replaceBadge: {
    backgroundColor: colors.YELLOW_00,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: -2,
  },
  replaceBadgeText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_60,
    lineHeight: 15.4,
  },
  requestCard: {
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
  },
  requestLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftLine: {
    width: 2,
    height: '100%',
    backgroundColor: colors.PRIMARY_50,
    borderRadius: 1,
    marginRight: 8,
    alignSelf: 'stretch',
    marginLeft: -8,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -4,
  },
  companyText: {
    fontSize: 12,
    color: colors.GRAY_60,
    fontWeight: '500',
    lineHeight: 16.8,
    marginRight: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  badgeText: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 11,
    color: colors.GRAY_60,
    fontWeight: '400',
    lineHeight: 15.4,
  },
  subTitle: {
    fontSize: 11,
    color: colors.GRAY_80,
    marginTop: 24,
    marginBottom: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    marginRight: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: colors.PRIMARY_50,
    borderColor: colors.PRIMARY_50,
  },
  checkboxLabel: {
    fontSize: 11,
    color: colors.GRAY_80,
    fontWeight: '400',
    lineHeight: 15.4,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  footer: {
    marginTop: 24,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sendBtn: {
    backgroundColor: colors.PRIMARY_50,
    borderRadius: 4,
    padding: 8,
    alignItems: 'center',
  },
  sendBtnText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.WHITE,
  },
});
