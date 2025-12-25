import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  requestReplaceOrRecall,
  ReplaceOrRecallPayload,
  getReplaceOrRecallUploadUrls,
  uploadImageToS3,
} from '../../api/vehicleStatus';

interface UseReplaceOrRecallParams {
  payload: ReplaceOrRecallPayload;
  photos: any[];
}

export const useReplaceOrRecall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, photos }: UseReplaceOrRecallParams) => {
      let finalPhotoKeys: string[] = [];

      if (photos.length > 0) {
        // 교체/회수 전용 업로드 URL 조회
        const allSlots = await getReplaceOrRecallUploadUrls(payload.carId);

        // 순차 업로드
        for (let i = 0; i < photos.length; i++) {
          const uploadRes = await uploadImageToS3(
            allSlots[i].uploadUrl,
            photos[i].uri,
          );

          if (!uploadRes.ok) {
            throw new Error(`UPLOAD_FAILED_AT_${i}`);
          }

          finalPhotoKeys.push(allSlots[i].fileKey);
        }
      }

      // 최종 API 호출 (isReplacement 값에 따라 교체 또는 회수로 처리됨)
      return requestReplaceOrRecall({ ...payload, photoKeys: finalPhotoKeys });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carStatusByLocation'] });
      queryClient.invalidateQueries({ queryKey: ['carsByLocation'] });
    },
    onError: (error: any) => {
      console.error('[ReplaceOrRecall Error]:', error.message);
    },
  });
};
