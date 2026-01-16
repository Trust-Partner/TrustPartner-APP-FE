import { useMutation } from '@tanstack/react-query';
import {
  getPartnerWaitingUploadUrls,
  requestPartnerWaiting,
  PartnerWaitingRequest,
} from '../../api/vehicleStatus';
import { uploadImageToS3 } from '../../api/vehicleStatus';

interface UsePartnerWaitingParams {
  carId: number;
  payload: Omit<PartnerWaitingRequest, 'photoKeys'>;
  photos: { uri: string }[];
}

export const usePartnerWaiting = () => {
  return useMutation({
    mutationFn: async ({ carId, payload, photos }: UsePartnerWaitingParams) => {
      let photoKeys: string[] = [];

      // 1. 업로드 URL 발급 (사진 있을 때만)
      if (photos.length > 0) {
        const uploadUrls = await getPartnerWaitingUploadUrls(carId);

        for (let i = 0; i < photos.length; i++) {
          const slot = uploadUrls[i];

          const uploadRes = await uploadImageToS3(
            slot.uploadUrl,
            photos[i].uri,
          );

          if (!uploadRes.ok) {
            throw new Error(`PARTNER_WAITING_PHOTO_UPLOAD_FAILED_${i}`);
          }

          photoKeys.push(slot.fileKey);
        }
      }

      // 2. 공업사 대기 상태 전환
      return await requestPartnerWaiting(carId, {
        ...payload,
        photoKeys,
      });
    },
  });
};
