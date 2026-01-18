import { GetContractDetailResponse } from '../api/contracts/contract';
import { ReplacementContractDraft } from '../types/ReplacementContractDraft';

export const mapReplacementContractDraftToForm = (
  data: GetContractDetailResponse,
): ReplacementContractDraft => ({
  contractId: data.contractId,

  customerName: data.customerDetail?.customerName,
  phone: data.customerDetail?.customerPhoneNumber,
  address: data.customerDetail?.customerAddress,

  customerCarModel: data.customerDetail?.customerCarType,
  customerCarNumber: data.customerDetail?.customerCarNumber,
  customerDisplacement: data.customerDetail?.customerCarDisplacement,

  insuranceCompany: data.insuranceDetail?.insuranceCompanyName,
  reportNumber: data.insuranceDetail?.insuranceApplicationNumber,

  requestCompany: data.partnerInfo?.partnerName,
  garageCompany: data.repairShopInfo?.partnerName,

  fuel: data.fuelQuantity,

  photos: data.contractFilePaths ?? [],
  signature: data.signatureFilePath,
});
