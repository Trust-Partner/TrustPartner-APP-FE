import { create } from 'zustand';
import { saveDraft, loadDraft } from '../utils/draftStorage';
import { DispatchDetail } from '../mock/vehicleStatus/vehicleDispatchDetailMock';

type ModalType =
  | 'none'
  | 'main'
  | 'general'
  | 'insurance'
  | 'replacement'
  | 'dispatch';

interface DraftData {
  [key: string]: any;
}

interface ContractModalState {
  visible: boolean;
  modalType: ModalType;
  options: {
    general: boolean;
    insurance: boolean;
    replacement: boolean;
    dispatch: boolean;
  };
  drafts: Record<string, DraftData>;

  selectedVehicle?: DispatchDetail; // 선택된 차량 정보 저장
  setSelectedVehicle: (v: DispatchDetail) => void;

  openModal: (type: ModalType) => void;
  closeModal: () => void;
  goTo: (type: ModalType) => void;

  saveDraft: (type: string, data: DraftData) => Promise<void>;
  loadDraft: (type: string) => Promise<DraftData | null>;
}

export const useContractModalStore = create<ContractModalState>(set => ({
  visible: false,
  modalType: 'none',
  options: {
    general: true,
    insurance: true,
    replacement: true,
    dispatch: true,
  },
  drafts: {},
  selectedVehicle: undefined,

  setSelectedVehicle: v => set({ selectedVehicle: v }),

  openModal: type =>
    set({
      visible: true,
      modalType: type,
    }),

  closeModal: () => set({ visible: false, modalType: 'none' }),

  goTo: type => set({ modalType: type }),

  saveDraft: async (type, data) => {
    await saveDraft(type, data);
    set(state => ({
      drafts: { ...state.drafts, [type]: data },
    }));
  },

  loadDraft: async type => {
    const draft = await loadDraft(type);
    if (draft) {
      set(state => ({
        drafts: { ...state.drafts, [type]: draft },
      }));
      return draft;
    }
    return null;
  },
}));
