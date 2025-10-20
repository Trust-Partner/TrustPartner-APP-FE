type CarRate = { type: string; amount: string };

export interface AdminMyInfo {
  name: string;
  role: string;
  branch: string;
  grade: string;
  carRatesByGrade: Record<string, CarRate[]>;
  gradeRates: { grade: string; name: string; rate: string }[];
}

export const adminMyInfoMock: AdminMyInfo = {
  name: '서승동',
  role: '매니저',
  branch: '정직 렌트카 도봉점',
  grade: '1등급',
  carRatesByGrade: {
    '1등급': [
      { type: '경차', amount: '₩ 59,837' },
      { type: '준중형세단', amount: '₩ 68,656' },
      { type: '중형세단', amount: '₩ 105,818' },
      { type: '대형세단', amount: '₩ 193,369' },
      { type: '초대형세단', amount: '₩ 298,558' },
      { type: '소형SUV', amount: '₩ 117,156' },
      { type: '준중형SUV', amount: '₩ 117,156' },
      { type: '중형SUV', amount: '₩ 181,402' },
      { type: '대형SUV', amount: '₩ 221,713' },
      { type: '카니발', amount: '₩ 184,550' },
    ],
    '2등급': [
      { type: '경차', amount: '₩ 53,853' },
      { type: '준중형세단', amount: '₩ 61,263' },
      { type: '중형세단', amount: '₩ 94,053' },
      { type: '대형세단', amount: '₩ 171,592' },
      { type: '초대형세단', amount: '₩ 264,872' },
      { type: '소형SUV', amount: '₩ 103,548' },
      { type: '준중형SUV', amount: '₩ 103,548' },
      { type: '중형SUV', amount: '₩ 160,035' },
      { type: '대형SUV', amount: '₩ 195,295' },
      { type: '카니발', amount: '₩ 162,480' },
    ],
    '3등급': [
      { type: '경차', amount: '₩ 49,590' },
      { type: '준중형세단', amount: '₩ 56,435' },
      { type: '중형세단', amount: '₩ 86,599' },
      { type: '대형세단', amount: '₩ 158,563' },
      { type: '초대형세단', amount: '₩ 244,815' },
      { type: '소형SUV', amount: '₩ 95,783' },
      { type: '준중형SUV', amount: '₩ 95,783' },
      { type: '중형SUV', amount: '₩ 148,096' },
      { type: '대형SUV', amount: '₩ 180,806' },
      { type: '카니발', amount: '₩ 150,369' },
    ],
    '4등급': [
      { type: '경차', amount: '₩ 47,870' },
      { type: '준중형세단', amount: '₩ 54,467' },
      { type: '중형세단', amount: '₩ 83,635' },
      { type: '대형세단', amount: '₩ 153,553' },
      { type: '초대형세단', amount: '₩ 237,701' },
      { type: '소형SUV', amount: '₩ 93,021' },
      { type: '준중형SUV', amount: '₩ 93,021' },
      { type: '중형SUV', amount: '₩ 143,678' },
      { type: '대형SUV', amount: '₩ 175,497' },
      { type: '카니발', amount: '₩ 145,943' },
    ],
    '5등급': [
      { type: '경차', amount: '₩ 45,750' },
      { type: '준중형세단', amount: '₩ 52,150' },
      { type: '중형세단', amount: '₩ 80,050' },
      { type: '대형세단', amount: '₩ 147,500' },
      { type: '초대형세단', amount: '₩ 228,000' },
      { type: '소형SUV', amount: '₩ 89,250' },
      { type: '준중형SUV', amount: '₩ 89,250' },
      { type: '중형SUV', amount: '₩ 137,000' },
      { type: '대형SUV', amount: '₩ 167,000' },
      { type: '카니발', amount: '₩ 139,000' },
    ],
  },
  gradeRates: [
    { grade: '1등급', name: '최우수 파트너', rate: '27%' },
    { grade: '2등급', name: '우수 파트너', rate: '24%' },
    { grade: '3등급', name: '양호 파트너', rate: '22%' },
    { grade: '4등급', name: '일반 파트너', rate: '21%' },
    { grade: '5등급', name: '신규 파트너', rate: '20%' },
  ],
};
