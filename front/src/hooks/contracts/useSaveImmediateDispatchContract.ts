import { useMutation } from '@tanstack/react-query';
import {
  SaveImmediateDispatchContractRequest,
  getImmediateDispatchUploadUrls,
  saveImmediateDispatchContract,
} from '../../api/contracts/userImmediateDispatch';
import { uploadImageToS3 } from '../../api/vehicleStatus';

interface UseSaveImmediateDispatchContractParams {
  carId: number;
  contractId: number;
  payload: Omit<
    SaveImmediateDispatchContractRequest,
    'contractPhotoKeys' | 'customerSignatureKey'
  >;
  contractPhotos: { uri: string }[];
  signaturePhoto?: { uri: string };
}

export const useSaveImmediateDispatchContract = () => {
  return useMutation({
    mutationFn: async ({
      carId,
      contractId,
      payload,
      contractPhotos,
      signaturePhoto,
    }: UseSaveImmediateDispatchContractParams) => {
      let contractPhotoKeys: string[] = [];
      let customerSignatureKey: string | undefined;

      // 업로드 URL 발급
      if (contractPhotos.length > 0 || signaturePhoto) {
        const uploadSlots = await getImmediateDispatchUploadUrls(carId);

        // 계약서 사진 업로드
        for (let i = 0; i < contractPhotos.length; i++) {
          const slot = uploadSlots[i];
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
          const signSlot = uploadSlots[contractPhotos.length];
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

      // 계약서 저장
      await saveImmediateDispatchContract(carId, contractId, {
        ...payload,
        contractPhotoKeys,
        customerSignatureKey,
      });
    },
  });
};
