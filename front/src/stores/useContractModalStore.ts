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

  selectedVehicle?: DispatchDetail;
  setSelectedVehicle: (v: DispatchDetail) => void;

  openModal: (type: ModalType) => void;
  closeModal: () => void;
  goTo: (type: ModalType) => void;

  saveDraft: (
    type: string,
    vehicleId: string,
    data: DraftData,
  ) => Promise<void>;
  loadDraft: (type: string, vehicleId: string) => Promise<DraftData | null>;
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

  saveDraft: async (type: string, vehicleId: string, data: DraftData) => {
    await saveDraft(type, vehicleId, data);
    set(state => ({
      drafts: { ...state.drafts, [`${type}_${vehicleId}`]: data },
    }));
  },

  loadDraft: async (type: string, vehicleId: string) => {
    const draft = await loadDraft(type, vehicleId);
    if (draft) {
      set(state => ({
        drafts: { ...state.drafts, [`${type}_${vehicleId}`]: draft },
      }));
      return draft;
    }
    return null;
  },
}));
