import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchContractUploadUrls,
  saveInsuranceContract,
  SaveInsuranceContractRequest,
} from '../../api/contracts/contract';
import { uploadImageToS3 } from '../../api/vehicleStatus';

interface UseSaveInsuranceContractParams {
  contractId: number;

  payload: Omit<
    SaveInsuranceContractRequest,
    'contractPhotoKeys' | 'customerSignatureKey'
  >;

  photos?: { uri: string }[];
  signatureUri?: string;
}

export const useSaveInsuranceContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contractId,
      payload,
      photos = [],
      signatureUri,
    }: UseSaveInsuranceContractParams) => {
      let contractPhotoKeys: string[] = [];
      let customerSignatureKey = '';

      // 업로드 URL 발급
      const uploadSlots = await fetchContractUploadUrls(contractId);

      // 계약서 사진 업로드
      for (let i = 0; i < photos.length; i++) {
        const uploadRes = await uploadImageToS3(
          uploadSlots.contractPhotos[i].uploadUrl,
          photos[i].uri,
        );

        if (!uploadRes.ok) {
          throw new Error(`CONTRACT_PHOTO_UPLOAD_FAILED_${i}`);
        }

        contractPhotoKeys.push(uploadSlots.contractPhotos[i].fileKey);
      }

      // 서명 업로드
      if (signatureUri) {
        const sigRes = await uploadImageToS3(
          uploadSlots.signaturePhoto.uploadUrl,
          signatureUri,
        );

        if (!sigRes.ok) {
          throw new Error('SIGNATURE_UPLOAD_FAILED');
        }

        customerSignatureKey = uploadSlots.signaturePhoto.fileKey;
      }

      // 계약서 저장
      await saveInsuranceContract(contractId, {
        ...payload,
        contractPhotoKeys,
        customerSignatureKey,
      });
    },

    onSuccess: (_, variables) => {
      if (!variables.payload.isDraft) {
        queryClient.invalidateQueries({
          queryKey: ['vehicleStatus', 'dispatchCarsByGrade'],
        });
      }
    },

    onError: (error: any) => {
      console.error('[InsuranceContract Error]:', error.message);
    },
  });
};
