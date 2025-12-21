import { useState, useRef, useEffect } from 'react';
import { Asset } from 'react-native-image-picker';
import { SignatureViewRef } from 'react-native-signature-canvas';
import { saveDraft } from '../utils/draftStorage';
import { useContractModalStore } from '../stores/useContractModalStore';

export type ContractPhoto =
  | { source: 'local'; asset: Asset }
  | { source: 'remote'; key: string; uri: string };

export function useContractForm(
  type: string,
  vehicleId?: string,
  onChange?: (data: any) => void,
) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [photos, setPhotos] = useState<ContractPhoto[]>([]);
  const [step, setStep] = useState(1);

  const formDataRef = useRef(formData);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const { saveDraft: saveToStore, loadDraft: loadFromStore } =
    useContractModalStore();

  // ✅ 임시저장 불러오기
  useEffect(() => {
    if (!vehicleId) return;

    const loadDraftOnMount = async () => {
      const loadedDraft = await loadFromStore(type, vehicleId);

      if (!loadedDraft) return;

      setFormData(loadedDraft.formData ?? {});
      setPhotos(loadedDraft.photos ?? []);
      setStep(loadedDraft.step ?? 1);

      onChangeRef.current?.(loadedDraft.formData ?? {});
    };

    loadDraftOnMount();
  }, [vehicleId, type, loadFromStore]);

  const updateField = (key: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [key]: value };
      onChangeRef.current?.(updated);
      return updated;
    });
  };

  const saveDraftData = async () => {
    if (!vehicleId) return;

    const draft = {
      formData: formDataRef.current,
      photos,
      step,
    };

    await saveDraft(type, vehicleId, draft);
    await saveToStore(type, vehicleId, draft);
  };

  const sigRef = useRef<SignatureViewRef>(null);

  return {
    formData,
    updateField,
    saveDraftData,
    step,
    nextStep: () => setStep(p => p + 1),
    prevStep: () => setStep(p => Math.max(1, p - 1)),

    // ✅ 사진 제어
    photos,
    addPhotos: (assets: Asset[]) =>
      setPhotos(prev => {
        const locals: ContractPhoto[] = assets.map(a => ({
          source: 'local' as const,
          asset: a,
        }));

        return [...prev, ...locals].slice(0, 9);
      }),

    replacePhoto: (index: number, asset: Asset) =>
      setPhotos(prev =>
        prev.map(
          (p, i): ContractPhoto =>
            i === index ? { source: 'local' as const, asset } : p,
        ),
      ),

    removePhoto: (index: number) =>
      setPhotos(prev => prev.filter((_, i) => i !== index)),

    sigRef,
    signatureStyle: `
      html, body { margin:0; padding:0; height:100%; background:#fff; }
      .m-signature-pad { height:100%; border:none; box-shadow:none; }
      .m-signature-pad--footer { display:none; }
    `,
  };
}
