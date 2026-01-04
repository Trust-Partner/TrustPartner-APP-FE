import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Clipboard } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import AppHeader from '../../components/common/AppHeader';
import ToastMessage from '../../components/common/ToastMessage';
import { useAuthStore } from '../../states/useAuthStore';
import { ContractHeaderSection } from './components/ContractHeaderSection';
import { ContractMemoSection } from './components/ContractMemoSection';
import { ContractDateSection } from './components/ContractDateSection';
import { ContractCustomerSection } from './components/ContractCustomerSection';
import { ContractAccidentSection } from './components/ContractAccidentSection';
import { ContractInsuranceClaimSection } from './components/ContractInsuranceClaimSection';
import { ContractPaymentSection } from './components/ContractPaymentSection';
import { CONTRACT_SECTIONS_BY_TYPE } from './constants';
import { RootStackParamList } from '../../navigations/root/RootNavigator';
import { s } from './styles';
import { contractMock } from '../../mock/ContractMockData';
import { useContractAccidentCar } from '../../hooks/contracts/useContractAccident';
import {
  useContractCustomer,
  useUpdateContractCustomer,
} from '../../hooks/contracts/useContractCustomer';
import {
  useContractInsuranceClaim,
  useUpdateContractInsuranceClaim,
} from '../../hooks/contracts/useContractInsuranceClaim';
import {
  useContractMemos,
  useCreateContractMemo,
} from '../../hooks/contracts/useContractMemo';
import { useContractPayment } from '../../hooks/contracts/useContractPayment';

type RouteProps = RouteProp<RootStackParamList, 'ContractIntegrated'>;

const ACCIDENT_STATUS_LABEL: Record<string, string> = {
  AVAILABLE: '대기중',
  IN_USE: '배차중',
  RETURN_REQUESTED: '반납신청',
};

const BILLING_STATUS_LABEL: Record<string, string> = {
  PENDING: '지급대기',
  CONFIRMED: '지급확정',
  COMPLETED_BILLED: '청구완료',
  COMPLETED_APPROVED: '입금완료',
  COMPLETED_UNAPPROVED: '입금완료',
  CANCELLED: '지급취소',
};

const ContractIntegratedScreen = () => {
  const { user } = useAuthStore();
  const route = useRoute<RouteProps>();

  const { contractId, contractType } = route.params;
  const sections = CONTRACT_SECTIONS_BY_TYPE[contractType];

  const [isEditMode, setIsEditMode] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const { data: memos = [] } = useContractMemos(contractId);
  const { data: customer } = useContractCustomer(contractId);
  const { data: accident } = useContractAccidentCar(contractId);
  const { data: insurance } = useContractInsuranceClaim(contractId);
  const { data: payment } = useContractPayment(contractId);

  const createMemoMutation = useCreateContractMemo(contractId);
  const updateCustomerMutation = useUpdateContractCustomer(contractId);
  const updateInsuranceMutation = useUpdateContractInsuranceClaim(contractId);

  // UI 타입 변환
  const memoUI = useMemo(
    () =>
      memos.map(m => ({
        id: m.contractId,
        writer: m.staffName,
        content: m.memo,
        createdAt: m.createdAt,
      })),
    [memos],
  );

  const customerUI = useMemo(
    () =>
      customer
        ? {
            name: customer.customerName,
            phone: customer.customerPhoneNumber,
            address: customer.customerAddress,
            carModel: customer.customerCarModel,
            carNumber: customer.customerCarNum,
          }
        : null,
    [customer],
  );

  const accidentUI = useMemo(() => {
    if (!accident) return null;

    return {
      status:
        accident.carStatuses?.map(s => ACCIDENT_STATUS_LABEL[s] ?? s) ?? [],
      carNumber: accident.customerCarNumber,
      carModel: accident.customerCarModel,
      displacement: accident.customerCarDisplacement,
      garage: accident.repairShopName,
      requestCompany: accident.partnerName,
    };
  }, [accident]);

  const insuranceUI = useMemo(() => {
    if (!insurance) return null;

    const status = insurance.billingStatus
      ? [
          BILLING_STATUS_LABEL[insurance.billingStatus] ??
            insurance.billingStatus,
        ]
      : [];

    return {
      status,
      company: insurance.insuranceCompany,
      claimNumber: insurance.caseNumber,
      manager: insurance.managerName,
      fax: insurance.faxNum,
      phone: insurance.managerPhoneNum,
    };
  }, [insurance]);

  const paymentUI = useMemo(
    () =>
      payment
        ? {
            method: payment.paymentMethod,
            time: payment.paymentTime,
            amount: String(payment.paymentAmount),
            note: payment.memo,
          }
        : null,
    [payment],
  );

  const [form, setForm] = useState<{
    customer?: typeof customerUI;
    insurance?: typeof insuranceUI;
  }>({});

  const [backup, setBackup] = useState(form);

  useEffect(() => {
    if (customerUI || insuranceUI) {
      const next = { customer: customerUI, insurance: insuranceUI };
      setForm(next);
      setBackup(next);
    }
  }, [customerUI, insuranceUI]);

  const handleAddMemo = (content: string) => {
    if (!user || user.kind !== 'ADMIN') return;

    createMemoMutation.mutate(
      {
        memo: content,
        staffId: user.staffId,
      },
      {
        onSuccess: () => {
          setToastMsg('메모가 추가되었습니다.');
        },
      },
    );
  };

  const handleCopy = (value: string, label: string) => {
    Clipboard.setString(value);
    setToastMsg(`${label}가 복사되었습니다.`);
  };

  const handleSave = () => {
    if (form.customer && customer) {
      updateCustomerMutation.mutate({
        customerName: form.customer.name,
        customerPhoneNumber: form.customer.phone,
        customerAddress: form.customer.address,
      });
    }

    if (form.insurance && insurance) {
      updateInsuranceMutation.mutate({
        insuranceCompany: form.insurance.company,
        caseNumber: form.insurance.claimNumber,
        managerName: form.insurance.manager,
        managerPhoneNum: form.insurance.phone,
        faxNum: form.insurance.fax,
      });
    }

    setBackup(form);
    setIsEditMode(false);
    setToastMsg('수정 내용이 저장되었습니다.');
  };

  const handleCancel = () => {
    setForm(backup);
    setIsEditMode(false);
  };

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
        <ContractHeaderSection
          model={customerUI?.carModel ?? ''}
          number={customerUI?.carNumber ?? ''}
          isEditMode={isEditMode}
          onEdit={() => {
            setBackup(form);
            setIsEditMode(true);
          }}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        {sections.includes('MEMO') && (
          <ContractMemoSection memos={memoUI} onAddMemo={handleAddMemo} />
        )}

        {sections.includes('DATE') && (
          <ContractDateSection contractDate={contractMock.contractDate} />
        )}

        {sections.includes('CUSTOMER') && form.customer && (
          <ContractCustomerSection
            isEditMode={isEditMode}
            customer={form.customer}
            onChange={(key, value) =>
              setForm(prev => ({
                ...prev,
                customer: { ...prev.customer!, [key]: value },
              }))
            }
            onCopy={handleCopy}
          />
        )}

        {sections.includes('ACCIDENT') && accidentUI && (
          <ContractAccidentSection accident={accidentUI} />
        )}

        {sections.includes('INSURANCE_CLAIM') && form.insurance && (
          <ContractInsuranceClaimSection
            isEditMode={isEditMode}
            insurance={form.insurance}
            onChange={(key, value) =>
              setForm(prev => ({
                ...prev,
                insurance: { ...prev.insurance!, [key]: value },
              }))
            }
            onCopy={handleCopy}
          />
        )}

        {sections.includes('PAYMENT') && paymentUI && (
          <ContractPaymentSection payment={paymentUI} />
        )}
      </ScrollView>

      {toastMsg && (
        <ToastMessage message={toastMsg} onHide={() => setToastMsg('')} />
      )}
    </View>
  );
};

export default ContractIntegratedScreen;
