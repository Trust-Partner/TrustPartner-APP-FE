export const carYearGroupMap: Record<string, string> = {
  UNDER_2: '2년 이하',
  AROUND_4: '4년 이내',
  OVER_5: '5년 이상',
};

export const displacementGroupMap: Record<string, string> = {
  UNDER_1000: '~1000cc',
  RANGE_1000_1600: '1000~1600cc',
  RANGE_1601_2000: '1601~2000cc',
  RANGE_2001_2500: '2001~2500cc',
  RANGE_2501_3000: '2501~3000cc',
  RANGE_3001_3500: '3001~3500cc',
  OVER_3500: '3500cc~',
};

// 라벨 배열
export const carYearLabels = Object.values(carYearGroupMap);
export const displacementLabels = Object.values(displacementGroupMap);

// ENUM → 라벨 변환 함수
export const getCarYearGroupLabel = (value?: string) =>
  value ? carYearGroupMap[value] ?? value : '-';

export const getDisplacementLabel = (value?: string) =>
  value ? displacementGroupMap[value] ?? value : '-';

// 한글 라벨 → ENUM 자동 역매핑
export const yearLabelToEnum: Record<string, string> = Object.fromEntries(
  Object.entries(carYearGroupMap).map(([key, label]) => [label, key]),
);

export const displacementLabelToEnum: Record<string, string> =
  Object.fromEntries(
    Object.entries(displacementGroupMap).map(([key, label]) => [label, key]),
  );
