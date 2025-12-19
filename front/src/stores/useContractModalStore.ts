import { create } from 'zustand';
import { saveDraft, loadDraft } from '../utils/draftStorage';
import { ContractVehicleBase } from '../types/contractVehicle';

type ModalType =
  | 'none'
  | 'main'
  | 'general'
  | 'insurance'
  | 'replacement'
  | 'dispatch';

type OriginType = 'main' | 'direct';

interface DraftData {
  [key: string]: any;
}

interface ContractModalState {
  visible: boolean;
  modalType: ModalType;
  originType: OriginType;

  options: {
    general: boolean;
    insurance: boolean;
    replacement: boolean;
    dispatch: boolean;
  };

  drafts: Record<string, DraftData>;

  selectedVehicle?: ContractVehicleBase | null;
  setSelectedVehicle: (v: ContractVehicleBase | null) => void;

  dispatchId?: number | null;
  setDispatchId: (id: number | null) => void;

  openModal: (type: ModalType, originType?: OriginType) => void;
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
  originType: 'main', // 기본은 main

  options: {
    general: true,
    insurance: true,
    replacement: true,
    dispatch: true,
  },

  drafts: {},
  selectedVehicle: undefined,

  dispatchId: null,

  setSelectedVehicle: v => set({ selectedVehicle: v }),

  setDispatchId: id => set({ dispatchId: id }),

  openModal: (type, originType = 'main') =>
    set({
      visible: true,
      modalType: type,
      originType,
    }),

  closeModal: () =>
    set({
      visible: false,
      modalType: 'none',
      originType: 'main',
      selectedVehicle: undefined,
      dispatchId: null,
    }),

  goTo: type => set({ modalType: type }),

  saveDraft: async (type, vehicleId, data) => {
    await saveDraft(type, vehicleId, data);
    set(state => ({
      drafts: { ...state.drafts, [`${type}_${vehicleId}`]: data },
    }));
  },

  loadDraft: async (type, vehicleId) => {
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
