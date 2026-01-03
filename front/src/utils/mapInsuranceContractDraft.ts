import { GetContractDetailResponse } from '../api/contracts/contract';
import { InsuranceContractDraft } from '../types/InsuranceContractDraft';

export const mapInsuranceContractDraftToForm = (
  data: GetContractDetailResponse,
): InsuranceContractDraft => ({
  contractId: data.contractId,
  fuelQuantity: data.fuelQuantity,

  customer: {
    name: data.customerDetail?.customerName,
    phone: data.customerDetail?.customerPhoneNumber,
    address: data.customerDetail?.customerAddress,
    carType: data.customerDetail?.customerCarType,
    carNumber: data.customerDetail?.customerCarNumber,
    carDisplacement: data.customerDetail?.customerCarDisplacement,
  },

  insurance: {
    companyName: data.insuranceDetail?.insuranceCompanyName,
    applicationNumber: data.insuranceDetail?.insuranceApplicationNumber,
  },

  partner: {
    id: data.partnerInfo?.partnerId,
    name: data.partnerInfo?.partnerName,
  },

  repairShop: {
    id: data.repairShopInfo?.partnerId,
    name: data.repairShopInfo?.partnerName,
  },

  photos: data.contractFilePaths ?? [],
  signature: data.signatureFilePath,
});
