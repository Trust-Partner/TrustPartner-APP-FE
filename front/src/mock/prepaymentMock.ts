export type PrepaymentItemType = {
  id: number;
  carName: string;
  carNumber: string;
  company: string;
  duration: string;
  status: 'waiting' | 'confirmed' | 'completed';
};

export const prepaymentMock: Record<
  'waiting' | 'current' | 'past',
  PrepaymentItemType[]
> = {
  /** 지급대기 */
  waiting: [
    {
      id: 1,
      carName: 'GV80',
      carNumber: '108호2000',
      company: '한라모터스',
      duration: '1시간 25분',
      status: 'waiting',
    },
    {
      id: 2,
      carName: '쏘렌토',
      carNumber: '48가3829',
      company: '현대정비소',
      duration: '2시간 03분',
      status: 'waiting',
    },
    {
      id: 3,
      carName: '그랜저 IG',
      carNumber: '11하8382',
      company: '강남오토',
      duration: '3시간 15분',
      status: 'waiting',
    },
    {
      id: 4,
      carName: 'K7 프리미어',
      carNumber: '49호1182',
      company: '대성렌터카',
      duration: '47분',
      status: 'waiting',
    },
    {
      id: 5,
      carName: '아반떼 CN7',
      carNumber: '25가7624',
      company: '동서울서비스',
      duration: '1시간 58분',
      status: 'waiting',
    },
  ],

  /** 당월 배차내역 */
  current: [
    {
      id: 6,
      carName: 'G80',
      carNumber: '08무8812',
      company: '경기모터스',
      duration: '5시간 12분',
      status: 'confirmed',
    },
    {
      id: 7,
      carName: 'K5 DL3',
      carNumber: '42라2871',
      company: '세종오토',
      duration: '1시간 44분',
      status: 'confirmed',
    },
    {
      id: 8,
      carName: '쏘나타 DN8',
      carNumber: '30너4481',
      company: '성남정비',
      duration: '2시간 20분',
      status: 'confirmed',
    },
    {
      id: 9,
      carName: 'GV70',
      carNumber: '33무4411',
      company: '부천렌터카',
      duration: '4시간 07분',
      status: 'confirmed',
    },
    {
      id: 10,
      carName: '스타리아',
      carNumber: '75러1134',
      company: '제주오토',
      duration: '6시간 42분',
      status: 'confirmed',
    },
    {
      id: 11,
      carName: '베뉴',
      carNumber: '21가9223',
      company: '청주정비소',
      duration: '1시간 31분',
      status: 'confirmed',
    },
    {
      id: 12,
      carName: '카니발',
      carNumber: '19가3012',
      company: '송파모터스',
      duration: '3시간 59분',
      status: 'confirmed',
    },
  ],

  /** 지난 배차내역 */
  past: [
    {
      id: 13,
      carName: 'GV60',
      carNumber: '38가9921',
      company: '대전정비소',
      duration: '2025-10-18 12:40',
      status: 'completed',
    },
    {
      id: 14,
      carName: 'K9',
      carNumber: '15가8742',
      company: '부산오토',
      duration: '2025-10-17 08:50',
      status: 'completed',
    },
    {
      id: 15,
      carName: '아반떼 N',
      carNumber: '41나2114',
      company: '천안렌터카',
      duration: '2025-10-15 14:20',
      status: 'completed',
    },
    {
      id: 16,
      carName: '팰리세이드',
      carNumber: '57러2229',
      company: '한성자동차',
      duration: '2025-10-14 10:15',
      status: 'completed',
    },
    {
      id: 17,
      carName: '모닝',
      carNumber: '66모9910',
      company: '광주정비센터',
      duration: '2025-10-12 09:00',
      status: 'completed',
    },
    {
      id: 18,
      carName: 'GV70 스포츠',
      carNumber: '08마3838',
      company: '울산렌트',
      duration: '2025-10-10 17:30',
      status: 'completed',
    },
    {
      id: 19,
      carName: '스포티지',
      carNumber: '12라5555',
      company: '익산정비소',
      duration: '2025-10-08 13:05',
      status: 'completed',
    },
    {
      id: 20,
      carName: '그랜저 Hybrid',
      carNumber: '98루2221',
      company: '평택모터스',
      duration: '2025-10-05 15:44',
      status: 'completed',
    },
  ],
};
