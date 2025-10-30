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
      return (
        selectedVehicle && (
          <GeneralContractModal
            onBack={() => goTo('main')}
            vehicle={selectedVehicle}
          />
        )
      );

    case 'insurance':
      return (
        selectedVehicle && (
          <InsuranceContractModal
            onBack={() => goTo('main')}
            vehicle={selectedVehicle}
          />
        )
      );

    case 'replacement':
      return (
        selectedVehicle && (
          <ReplacementContractModal
            onBack={() => goTo('main')}
            vehicle={selectedVehicle}
          />
        )
      );

    case 'dispatch':
      return (
        selectedVehicle && (
          <DispatchConfirmModal
            onBack={() => goTo('main')}
            vehicle={selectedVehicle}
          />
        )
      );

    default:
      return null;
  }
}
