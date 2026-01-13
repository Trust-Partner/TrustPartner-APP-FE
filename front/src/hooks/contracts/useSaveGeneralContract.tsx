import { useMutation } from '@tanstack/react-query';
import {
  getContractUploadUrls,
  saveGeneralContract,
  SaveGeneralContractRequest,
} from '../../api/contracts/contract';
import { uploadImageToS3 } from '../../api/vehicleStatus';

interface UseSaveGeneralContractParams {
  contractId: number;
  payload: Omit<
    SaveGeneralContractRequest,
    'contractPhotoKeys' | 'customerSignatureKey'
  >;
  contractPhotos: { uri: string }[];
  signaturePhoto?: { uri: string };
}

export const useSaveGeneralContract = () => {
  return useMutation({
    mutationFn: async ({
      contractId,
      payload,
      contractPhotos,
      signaturePhoto,
    }: UseSaveGeneralContractParams) => {
      let contractPhotoKeys: string[] = [];
      let customerSignatureKey: string | undefined;

      // 업로드 URL 발급
      if (contractPhotos.length > 0 || signaturePhoto) {
        const uploadUrls = await getContractUploadUrls(contractId);

        // 계약서 사진 업로드
        for (let i = 0; i < contractPhotos.length; i++) {
          const slot = uploadUrls.contractPhotos[i];
          const uploadRes = await uploadImageToS3(
            slot.uploadUrl,
            contractPhotos[i].uri,
          );

          if (!uploadRes.ok) {
            throw new Error(`CONTRACT_PHOTO_UPLOAD_FAILED_${i}`);
          }

          contractPhotoKeys.push(slot.fileKey);
        }

        // 서명 업로드
        if (signaturePhoto) {
          const signSlot = uploadUrls.signaturePhoto;
          const uploadRes = await uploadImageToS3(
            signSlot.uploadUrl,
            signaturePhoto.uri,
          );

          if (!uploadRes.ok) {
            throw new Error('SIGNATURE_UPLOAD_FAILED');
          }

          customerSignatureKey = signSlot.fileKey;
        }
      }

      // 일반 계약서 저장
      await saveGeneralContract(contractId, {
        ...payload,
        contractPhotoKeys,
        customerSignatureKey,
      });
    },
  });
};
