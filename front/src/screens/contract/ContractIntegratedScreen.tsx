import React, { useState } from 'react';
import { View, Text, ScrollView, Clipboard } from 'react-native';
import AppHeader from '../../components/common/AppHeader';
import ToastMessage from '../../components/common/ToastMessage';

import { useAuthStore } from '../../states/useAuthStore';
import { contractMock } from '../../mock/ContractMockData';

import { ContractHeaderSection } from './components/ContractHeaderSection';
import { ContractMemoSection } from './components/ContractMemoSection';
import { ContractDateSection } from './components/ContractDateSection';
import { ContractCustomerSection } from './components/ContractCustomerSection';
import { ContractAccidentSection } from './components/ContractAccidentSection';
import { ContractInsuranceClaimSection } from './components/ContractInsuranceClaimSection';
import { ContractExchangeSection } from './components/ContractExchangeSection';
import { ContractPaymentSection } from './components/ContractPaymentSection';

import { s } from './styles';

const ContractIntegratedScreen = () => {
  const { user } = useAuthStore();

  /** ---------- state ---------- */
  const [isEditMode, setIsEditMode] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [memos, setMemos] = useState(contractMock.memoList);

  const [form, setForm] = useState({
    customer: { ...contractMock.customer },
    insurance: { ...contractMock.insurance },
  });
  const [backup, setBackup] = useState(form);

  /** ---------- handlers ---------- */
  const handleAddMemo = (content: string) => {
    const now = new Date();
    const createdAt =
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        '0',
      )}-${String(now.getDate()).padStart(2, '0')} ` +
      `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes(),
      ).padStart(2, '0')}`;

    setMemos(prev => [
      ...prev,
      {
        id: Date.now(),
        writer: user?.name ?? '알 수 없음',
        content,
        createdAt,
      },
    ]);
  };

  const handleCopy = (value: string, label: string) => {
    Clipboard.setString(value);
    setToastMsg(`${label}가 복사되었습니다.`);
  };

  const handleSave = () => {
    console.log('저장 데이터:', form);
    setBackup(form);
    setIsEditMode(false);
    setToastMsg('수정 내용이 저장되었습니다.');
  };

  const handleCancel = () => {
    setForm(backup);
    setIsEditMode(false);
  };

  /** ---------- render ---------- */
  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        canGoBack
        centerContent={<Text style={s.header}>계약서 정보</Text>}
      />

      <ScrollView
        style={s.container}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {/* 상단 헤더 */}
        <ContractHeaderSection
          model={contractMock.car.model}
          number={contractMock.car.number}
          isEditMode={isEditMode}
          onEdit={() => {
            setBackup(form);
            setIsEditMode(true);
          }}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        {/* 메모 */}
        <ContractMemoSection memos={memos} onAddMemo={handleAddMemo} />

        {/* 계약 일시 */}
        <ContractDateSection contractDate={contractMock.contractDate} />

        {/* 고객 정보 */}
        <ContractCustomerSection
          isEditMode={isEditMode}
          customer={form.customer}
          onChange={(key, value) =>
            setForm(prev => ({
              ...prev,
              customer: { ...prev.customer, [key]: value },
            }))
          }
          onCopy={handleCopy}
        />

        {/* 사고 차량 정보 */}
        <ContractAccidentSection accident={contractMock.accident} />

        {/* 보험사 청구 */}
        <ContractInsuranceClaimSection
          isEditMode={isEditMode}
          insurance={form.insurance}
          onChange={(key, value) =>
            setForm(prev => ({
              ...prev,
              insurance: { ...prev.insurance, [key]: value },
            }))
          }
          onCopy={handleCopy}
        />

        {/* 교체 계약서 */}
        <ContractExchangeSection exchange={contractMock.exchangeContract} />

        {/* 결제 정보 */}
        <ContractPaymentSection payment={contractMock.payment} />
      </ScrollView>

      {toastMsg && (
        <ToastMessage message={toastMsg} onHide={() => setToastMsg('')} />
      )}
    </View>
  );
};

export default ContractIntegratedScreen;
