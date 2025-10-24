import React from 'react';
import { useContractModalStore } from '../../stores/useContractModalStore';
import DispatchConfirmModal from './DispatchConfirmModal';
import GeneralContractModal from './GeneralContractModal';
import InsuranceContractModal from './InsuranceContractModal';
import MainContractModal from './MainContractModal';
import ReplacementContractModal from './ReplacementContractModal';

export default function ContractModalManager() {
  const { visible, modalType, closeModal, goTo, selectedVehicle } =
    useContractModalStore();

  if (!visible) return null;

  switch (modalType) {
    case 'main':
      return (
        selectedVehicle && (
          <MainContractModal
            visible={visible}
            onSelect={goTo}
            onClose={closeModal}
            vehicle={selectedVehicle}
          />
        )
      );

    case 'general':
      return <GeneralContractModal onBack={() => goTo('main')} />;

    case 'insurance':
      return <InsuranceContractModal onBack={() => goTo('main')} />;
    case 'replacement':
      return <ReplacementContractModal onBack={() => goTo('main')} />;
    case 'dispatch':
      return <DispatchConfirmModal onBack={() => goTo('main')} />;
    default:
      return null;
  }
}
