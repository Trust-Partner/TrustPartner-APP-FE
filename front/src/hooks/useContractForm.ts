import { useState, useRef, useEffect } from 'react';
import { Asset } from 'react-native-image-picker';
import { SignatureViewRef } from 'react-native-signature-canvas';
import { saveDraft } from '../utils/draftStorage';
import { useContractModalStore } from '../stores/useContractModalStore';

export function useContractForm(
  type: string,
  vehicleId?: string,
  onChange?: (data: any) => void,
) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [photos, setPhotos] = useState<Asset[]>([]);
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

  useEffect(() => {
    if (!vehicleId) return;

    const loadDraftOnMount = async () => {
      const loadedDraft = await loadFromStore(type, vehicleId);

      if (loadedDraft) {
        const loadedFormData = loadedDraft.formData || {};

        setFormData(loadedFormData);
        setPhotos(loadedDraft.photos || []);
        setStep(loadedDraft.step || 1);

        if (onChangeRef.current) {
          onChangeRef.current(loadedFormData);
        }
      }
    };

    loadDraftOnMount();
  }, [vehicleId, type, loadFromStore]);

  const updateField = (key: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [key]: value };
      if (onChangeRef.current) onChangeRef.current(updated);
      return updated;
    });
  };

  const getMissingFields = (required: string[]) =>
    required.filter(k => !formData[k] || formData[k] === '');

  const saveDraftData = async () => {
    if (!vehicleId) return;

    const draft = { formData: { ...formDataRef.current }, photos, step };
    await saveDraft(type, vehicleId, draft);
    await saveToStore(type, vehicleId, draft);
  };

  const sigRef = useRef<SignatureViewRef>(null);
  const signatureStyle = `
    html, body { margin:0; padding:0; overflow:hidden; height:100%; background:#fff; }
    .m-signature-pad { height:100%; border:none; box-shadow:none; }
    .m-signature-pad--footer { display:none; }
  `;

  return {
    formData,
    updateField,
    getMissingFields,
    saveDraftData,
    step,
    nextStep: () => setStep(p => p + 1),
    prevStep: () => setStep(p => Math.max(1, p - 1)),
    photos,
    addPhotos: (a: Asset[]) => setPhotos(p => [...p, ...a].slice(0, 9)),
    replacePhoto: (i: number, n: Asset) =>
      setPhotos(p => p.map((x, idx) => (idx === i ? n : x))),
    removePhoto: (i: number) => setPhotos(p => p.filter((_, idx) => idx !== i)),
    sigRef,
    signatureStyle,
  };
}
