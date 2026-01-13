/**
 * Typography and UI sizing constants
 * 모든 폰트 사이즈와 버튼/패딩 사이즈를 중앙 관리
 */

export const fontSizes = {
  /** 가장 작은 텍스트 (라벨, 설명 등) */
  xs: 12, // 원래 11
  /** 작은 텍스트 (일반 텍스트, 버튼 텍스트) */
  sm: 13, // 원래 12
  /** 중간 크기 텍스트 */
  md: 15, // 원래 14
  /** 제목 텍스트 */
  lg: 17, // 원래 16
  /** 큰 숫자/값 */
  xl: 22, // 원래 20
  /** 매우 큰 값 */
  xxl: 26, // 원래 24
};

export const buttonSizes = {
  /** 작은 버튼 패딩 */
  sm: {
    paddingVertical: 10, // 원래 4-5
    paddingHorizontal: 14, // 원래 8
  },
  /** 중간 버튼 패딩 */
  md: {
    paddingVertical: 14, // 원래 8
    paddingHorizontal: 14, // 원래 12
  },
  /** 큰 버튼 패딩 */
  lg: {
    paddingVertical: 16, // 원래 10
    paddingHorizontal: 18, // 원래 16
  },
};

export const spacing = {
  /** 작은 간격 */
  xs: 4,
  sm: 6, // 원래 4
  /** 중간 간격 */
  md: 10, // 원래 8
  /** 큰 간격 */
  lg: 14, // 원래 12
  /** 매우 큰 간격 */
  xl: 18, // 원래 16
  xxl: 24, // 원래 20
};

