import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Platform,
  Image,
  Dimensions,
  Clipboard,
} from 'react-native';
import AppHeader from '../../components/common/AppHeader';
import ToastMessage from '../../components/common/ToastMessage';
import { colors } from '../../constants/colors';
import { HIT_SLOP } from '../../constants/touch';
import { contractMock } from '../../mock/ContractMockData';
import { useAuthStore } from '../../states/useAuthStore';

const ContractIntegratedScreen = () => {
  const { user } = useAuthStore();

  const [memos, setMemos] = useState(contractMock.memoList);
  const [newMemo, setNewMemo] = useState('');
  ('');
  const [toastMsg, setToastMsg] = useState('');

  const [isEditMode, setIsEditMode] = useState(false);
  const [form, setForm] = useState({
    customer: { ...contractMock.customer },
    insurance: { ...contractMock.insurance },
  });
  const [backup, setBackup] = useState(form);

  const addMemo = () => {
    if (!newMemo.trim()) return;

    const now = new Date();
    const formatted =
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        '0',
      )}-${String(now.getDate()).padStart(2, '0')} ` +
      `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes(),
      ).padStart(2, '0')}`;

    setMemos([
      ...memos,
      {
        id: Date.now(),
        writer: user?.name ?? '알 수 없음',
        content: newMemo,
        createdAt: formatted,
      },
    ]);

    setNewMemo('');
  };

  const handleCopy = (text: string, label: string) => {
    Clipboard.setString(text);
    setToastMsg(`${label}가 복사되었습니다.`);
  };

  const handleSave = () => {
    console.log('수정된 데이터:', form);
    setToastMsg('수정 내용이 저장되었습니다.');
    setBackup(form);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setForm(backup);
    setIsEditMode(false);
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <AppHeader
        canGoBack
        centerContent={<Text style={s.header}>계약서 정보</Text>}
      />
      <ScrollView
        style={s.container}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {/* 상단 차량명 + 차량번호 영역 */}
        <View style={s.vehicleBox}>
          <Text style={s.vehicleModel}>{contractMock.car.model}</Text>
          <Text style={s.vehicleNumber}>{contractMock.car.number}</Text>
        </View>

        {/* 버튼 영역 */}
        <View style={s.buttonRow}>
          {isEditMode ? (
            <>
              <Pressable style={s.topBtn} onPress={handleCancel}>
                <Text style={s.topBtnText}>취소하기</Text>
              </Pressable>
              <Pressable
                style={[s.topBtn, { backgroundColor: colors.PRIMARY_50 }]}
                onPress={handleSave}
              >
                <Image
                  source={require('../../assets/common/save.png')}
                  style={[s.iconSmall, { tintColor: colors.WHITE }]}
                />
                <Text style={[s.topBtnText, { color: colors.WHITE }]}>
                  저장하기
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable style={s.topBtn}>
                <Image
                  source={require('../../assets/common/download.png')}
                  style={[s.iconSmall, { tintColor: colors.PRIMARY_50 }]}
                />
                <Text style={s.topBtnText}>다운로드</Text>
              </Pressable>
              <Pressable
                style={s.topBtn}
                onPress={() => {
                  setBackup(form);
                  setIsEditMode(true);
                }}
              >
                <Image
                  source={require('../../assets/common/correction.png')}
                  style={[s.iconSmall, { tintColor: colors.PRIMARY_50 }]}
                />
                <Text style={s.topBtnText}>수정하기</Text>
              </Pressable>
            </>
          )}
        </View>

        {/* 메모 */}
        <View style={s.card}>
          <View style={s.cardTitleRow}>
            <Image
              source={require('../../assets/common/memo.png')}
              style={s.iconSmall}
            />
            <Text style={s.cardTitle}>메모</Text>
          </View>
          <ScrollView
            style={{ maxHeight: Dimensions.get('window').height * 0.3 }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            <View style={s.memoContainerBox}>
              {memos.map(m => (
                <View key={m.id} style={s.memoBox}>
                  <View style={s.memoRow}>
                    <Text style={s.memoDate}>{m.createdAt}</Text>
                    <Text style={s.memoWriter}>{m.writer}</Text>
                  </View>
                  <Text style={s.memoContent}>{m.content}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={s.memoInputRow}>
            <TextInput
              value={newMemo}
              onChangeText={setNewMemo}
              placeholder="메모를 입력하세요"
              placeholderTextColor={colors.GRAY_50}
              textAlignVertical="top"
              style={s.memoInput}
            />
            <Pressable
              onPress={addMemo}
              disabled={!newMemo.trim()}
              style={[
                s.memoAddBtn,
                {
                  backgroundColor: newMemo.trim()
                    ? colors.PRIMARY_50
                    : colors.GRAY_15,
                },
              ]}
            >
              <Text style={s.memoAddText}>＋</Text>
            </Pressable>
          </View>
        </View>

        {/* 계약 일시 */}
        <View style={s.card}>
          <View style={s.cardTitleRow}>
            <Image
              source={require('../../assets/common/calendar.png')}
              style={s.iconSmall}
            />
            <Text style={s.cardTitle}>계약 일시</Text>
          </View>
          <View style={{ gap: 8 }}>
            <InfoRow
              label="계약 체결일"
              value={contractMock.contractDate.start}
            />
            <InfoRow
              label="차량 반납일"
              value={contractMock.contractDate.end}
            />
            <InfoRow
              label="렌트기간"
              value={contractMock.contractDate.period}
            />
          </View>
        </View>

        {/* 고객 정보 */}
        <View style={s.card}>
          <View style={s.cardTitleRow}>
            <Image
              source={require('../../assets/common/person.png')}
              style={s.iconSmall}
            />
            <Text style={s.cardTitle}>고객 정보</Text>
          </View>
          {isEditMode ? (
            <View style={{ gap: 8 }}>
              <EditRow
                label="이름"
                value={form.customer.name}
                onChangeText={t =>
                  setForm(p => ({
                    ...p,
                    customer: { ...p.customer, name: t },
                  }))
                }
              />
              <EditRow
                label="연락처"
                value={form.customer.phone}
                onChangeText={t =>
                  setForm(p => ({
                    ...p,
                    customer: { ...p.customer, phone: t },
                  }))
                }
              />
              <EditRow
                label="주소"
                value={form.customer.address}
                onChangeText={t =>
                  setForm(p => ({
                    ...p,
                    customer: { ...p.customer, address: t },
                  }))
                }
              />
            </View>
          ) : (
            <View style={{ gap: 8 }}>
              <InfoRow label="이름" value={form.customer.name} />
              <InfoRow
                label="연락처"
                value={form.customer.phone}
                copyable
                onCopy={handleCopy}
              />
              <InfoRow
                label="주소"
                value={form.customer.address}
                copyable
                onCopy={handleCopy}
              />
            </View>
          )}
        </View>

        {/* 사고 차량 정보 */}
        <View style={s.card}>
          <View style={s.cardTitleRow}>
            <Image
              source={require('../../assets/common/file_icon.png')}
              style={s.iconSmall}
            />
            <Text style={s.cardTitle}>사고 차량 정보</Text>
          </View>
          <View style={{ gap: 8 }}>
            <StatusRow label="진행상태" value={contractMock.accident.status} />
            <InfoRow
              label="고객 차량번호"
              value={contractMock.accident.carNumber}
            />
            <InfoRow label="고객 차종" value={contractMock.accident.carModel} />
            <InfoRow
              label="고객 배기량"
              value={contractMock.accident.displacement}
            />
            <InfoRow label="입고 공업사" value={contractMock.accident.garage} />
            <InfoRow
              label="요청업체"
              value={contractMock.accident.requestCompany}
            />
          </View>
        </View>

        {/* 보험사 청구 */}
        <View style={s.card}>
          <View style={s.cardTitleRow}>
            <Image
              source={require('../../assets/common/file_icon.png')}
              style={s.iconSmall}
            />
            <Text style={s.cardTitle}>보험사 청구</Text>
          </View>

          {isEditMode ? (
            <View style={{ gap: 8 }}>
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>진행상태</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 4,
                    justifyContent: 'flex-end',
                  }}
                >
                  {['지급대기', '지급확정', '청구완료', '입금완료'].map(
                    status => {
                      const selected = form.insurance.status === status;
                      return (
                        <Pressable
                          key={status}
                          onPress={() =>
                            setForm(p => ({
                              ...p,
                              insurance: { ...p.insurance, status },
                            }))
                          }
                          style={[
                            s.tagSingle,
                            {
                              backgroundColor: selected
                                ? colors.PRIMARY_10
                                : colors.GRAY_05,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              s.tagText,
                              {
                                color: selected
                                  ? colors.PRIMARY_50
                                  : colors.GRAY_50,
                              },
                            ]}
                          >
                            {status}
                          </Text>
                        </Pressable>
                      );
                    },
                  )}
                </View>
              </View>
              <EditRow
                label="보험사"
                value={form.insurance.company}
                onChangeText={t =>
                  setForm(p => ({
                    ...p,
                    insurance: { ...p.insurance, company: t },
                  }))
                }
              />
              <EditRow
                label="접수 번호"
                value={form.insurance.claimNumber}
                onChangeText={t =>
                  setForm(p => ({
                    ...p,
                    insurance: { ...p.insurance, claimNumber: t },
                  }))
                }
              />
              <EditRow
                label="담당자"
                value={form.insurance.manager}
                onChangeText={t =>
                  setForm(p => ({
                    ...p,
                    insurance: { ...p.insurance, manager: t },
                  }))
                }
              />
              <EditRow
                label="담당자 팩스"
                value={form.insurance.fax}
                onChangeText={t =>
                  setForm(p => ({
                    ...p,
                    insurance: { ...p.insurance, fax: t },
                  }))
                }
              />
              <EditRow
                label="담당자 연락처"
                value={form.insurance.phone}
                onChangeText={t =>
                  setForm(p => ({
                    ...p,
                    insurance: { ...p.insurance, phone: t },
                  }))
                }
              />
            </View>
          ) : (
            <View style={{ gap: 8 }}>
              <StatusRow label="진행상태" value={form.insurance.status} />
              <InfoRow label="보험사" value={form.insurance.company} />
              <InfoRow label="접수 번호" value={form.insurance.claimNumber} />
              <InfoRow label="담당자" value={form.insurance.manager} />
              <InfoRow
                label="담당자 팩스"
                value={form.insurance.fax}
                copyable
                onCopy={handleCopy}
              />
              <InfoRow
                label="담당자 연락처"
                value={form.insurance.phone}
                copyable
                onCopy={handleCopy}
              />
            </View>
          )}
        </View>

        {/* 교체 계약서 */}
        <View style={s.card}>
          <View style={s.cardTitleRow}>
            <Image
              source={require('../../assets/common/calendar.png')}
              style={s.iconSmall}
            />
            <Text style={s.cardTitle}>교체 계약서</Text>
          </View>
          <View style={{ gap: 8 }}>
            <InfoRow
              label="교체일"
              value={contractMock.exchangeContract.date}
            />
            <InfoRow
              label="차량 반납일"
              value={contractMock.exchangeContract.returnDate}
            />
            <InfoRow
              label="렌트기간"
              value={contractMock.exchangeContract.period}
            />
            <InfoRow
              label="렌트 차량"
              value={contractMock.exchangeContract.model}
            />
            <InfoRow
              label="렌트 차량번호"
              value={contractMock.exchangeContract.number}
            />
          </View>
        </View>

        {/* 결제 정보 */}
        <View style={s.card}>
          <View style={s.cardTitleRow}>
            <Image
              source={require('../../assets/common/money.png')}
              style={s.iconSmall}
            />
            <Text style={s.cardTitle}>결제 정보</Text>
          </View>
          <View style={{ gap: 8 }}>
            <InfoRow label="결제방식" value={contractMock.payment.method} />
            <InfoRow label="결제시점" value={contractMock.payment.time} />
            <InfoRow label="금액" value={contractMock.payment.amount} />
            <InfoRow label="메모사항" value={contractMock.payment.note} />
          </View>
        </View>
      </ScrollView>

      {toastMsg ? (
        <ToastMessage message={toastMsg} onHide={() => setToastMsg('')} />
      ) : null}
    </View>
  );
};

export default ContractIntegratedScreen;

const InfoRow = ({
  label,
  value,
  copyable,
  onCopy,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  onCopy?: (value: string, label: string) => void;
}) => (
  <View style={s.infoRow}>
    <Text style={s.infoLabel}>{label}</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Text style={s.infoValue}>{value}</Text>
      {copyable && (
        <Pressable
          onPress={() => onCopy?.(value, label)}
          hitSlop={HIT_SLOP.SAFE_VERTICAL}
        >
          <Image
            source={require('../../assets/common/copy.png')}
            style={{ width: 14, height: 14, tintColor: colors.GRAY_80 }}
          />
        </Pressable>
      )}
    </View>
  </View>
);

const StatusRow = ({ label, value }: { label: string; value: string }) => (
  <View style={s.infoRow}>
    <Text style={s.infoLabel}>{label}</Text>
    <View style={s.tagSingle}>
      <Text style={s.tagText}>{value}</Text>
    </View>
  </View>
);

const EditRow = ({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}) => (
  <View style={s.infoRow}>
    <Text style={[s.infoLabel, { flex: 0.4, minWidth: 80 }]} numberOfLines={1}>
      {label}
    </Text>
    <TextInput
      style={{
        flex: 0.6,
        minWidth: 140,
        backgroundColor: colors.GRAY_05,
        borderWidth: 1,
        borderColor: colors.GRAY_10,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: Platform.OS === 'android' ? 0 : 8,
        fontSize: 11,
        color: colors.GRAY_90,
      }}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_00,
    padding: 16,
  },
  header: {
    fontSize: 14,
    color: colors.GRAY_90,
  },
  vehicleBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.GRAY_10,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    columnGap: 8,
  },
  vehicleModel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.GRAY_90,
    lineHeight: 22.4,
  },
  vehicleNumber: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.GRAY_60,
    lineHeight: 16.8,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginBottom: 18,
  },
  iconSmall: {
    width: 16,
    height: 16,
    tintColor: colors.GRAY_80,
  },
  topBtn: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    borderColor: colors.PRIMARY_50,
    columnGap: 8,
  },
  topBtnText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.PRIMARY_50,
    lineHeight: 15.4,
  },

  card: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    backgroundColor: colors.WHITE,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.GRAY_80,
    marginTop: Platform.OS === 'android' ? -3 : 0,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_50,
  },
  infoValue: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_80,
  },

  tagSingle: {
    backgroundColor: colors.PRIMARY_10,
    borderRadius: 18,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    color: colors.PRIMARY_50,
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15.4,
  },

  memoContainerBox: {
    backgroundColor: colors.GRAY_05,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    padding: 8,
    gap: 8,
  },
  memoBox: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 10,
    padding: 10,
  },
  memoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  memoDate: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_50,
  },
  memoWriter: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.PRIMARY_50,
  },
  memoContent: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.GRAY_80,
  },

  memoInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  memoInput: {
    flex: 1,
    backgroundColor: colors.GRAY_05,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    padding: 8,
    fontSize: 11,
    fontWeight: 400,
    color: colors.GRAY_50,
    lineHeight: 15.4,
  },
  memoAddBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: colors.PRIMARY_50,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  memoAddText: { color: colors.WHITE, fontSize: 16, fontWeight: '600' },
});
