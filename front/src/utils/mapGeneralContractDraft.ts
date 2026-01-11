import { GetGeneralContractDraftResponse } from '../api/contracts/contract';
import { GeneralContractDraft } from '../types/GeneralContractDraft';

export const mapGeneralContractDraftToForm = (
  data: GetGeneralContractDraftResponse,
): GeneralContractDraft => ({
  contractId: data.contractId,
  fuelQuantity: data.fuelQuantity,
  memo: data.memo,

  customer: {
    name: data.customerDetail?.customerName,
    phone: data.customerDetail?.customerPhoneNumber,
    address: data.customerDetail?.customerAddress,
  },

  payment: {
    method: data.paymentDetail?.paymentMethod,
    time: data.paymentDetail?.paymentTime,
    amount: data.paymentDetail?.paymentAmount,
  },

  photos: data.contractFilePaths ?? [],
  signature: data.signatureFilePath,
});
