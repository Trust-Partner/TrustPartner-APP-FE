/**
 * 전화번호를 UI 표시용 포맷으로 변환
 * - 01012345678  -> 010-1234-5678
 * - 021234567    -> 02-123-4567
 * - 0311234567  -> 031-123-4567
 */
export const formatPhoneNumber = (phone?: string) => {
  if (!phone) return '';

  // 숫자만 추출
  const onlyNumber = phone.replace(/\D/g, '');

  // 휴대폰 (010-xxxx-xxxx)
  if (onlyNumber.length === 11) {
    return onlyNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }

  // 지역번호 (02, 031 등)
  if (onlyNumber.length === 9 || onlyNumber.length === 10) {
    return onlyNumber.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1-$2-$3');
  }

  // 그 외는 원본 반환
  return phone;
};
