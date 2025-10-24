import { useEffect, useState } from 'react';
import { useContractModalStore } from '../stores/useContractModalStore';
import { saveDraft, loadDraft } from '../utils/draftStorage';

interface ContractForm {
  [key: string]: any;
}

export function useContractForm(type: string) {
  const [formData, setFormData] = useState<ContractForm>({});
  const [step, setStep] = useState(1);

  const { saveDraft: saveToStore, loadDraft: loadFromStore } =
    useContractModalStore();

  // 첫 진입 시 로컬 저장된 임시 데이터 불러오기
  useEffect(() => {
    (async () => {
      const saved = await loadDraft(type);
      if (saved) setFormData(saved);
    })();
  }, [type]);

  // 입력 필드 업데이트
  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // 임시저장 (AsyncStorage + Zustand 동시 저장)
  const saveDraftData = async () => {
    await saveDraft(type, formData);
    await saveToStore(type, formData);
  };

  // 불러오기 (Zustand 저장 데이터)
  const loadDraftData = async () => {
    const data = await loadFromStore(type);
    if (data) setFormData(data);
  };

  // 폼 초기화
  const resetForm = () => setFormData({});

  // 단계 이동
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => (prev > 1 ? prev - 1 : prev));

  return {
    formData,
    updateField,
    saveDraftData,
    loadDraftData,
    resetForm,
    step,
    nextStep,
    prevStep,
  };
}
