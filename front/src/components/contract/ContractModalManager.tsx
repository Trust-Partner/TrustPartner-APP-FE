import React from 'react';
import { useContractModalStore } from '../../stores/useContractModalStore';
import DispatchConfirmModal from './DispatchConfirmModal';
import GeneralContractModal from './GeneralContractModal';
import InsuranceContractModal from './InsuranceContractModal';
import MainContractModal from './MainContractModal';
import ReplacementContractModal from './ReplacementContractModal';

export default function ContractModalManager({
  onCloseComplete,
}: {
  onCloseComplete?: () => void;
}) {
  const { visible, modalType, closeModal, goTo, selectedVehicle, originType } =
    useContractModalStore();

  if (!visible || !selectedVehicle) return null;

  const handleBack = () => {
    if (originType === 'main') goTo('main');
    else closeModal();
  };

  const handleClose = () => {
    closeModal();
    onCloseComplete?.();
  };

  switch (modalType) {
    case 'main':
      return (
        selectedVehicle && (
          <MainContractModal
            visible={visible}
            onClose={handleClose}
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
            onBack={handleBack}
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
