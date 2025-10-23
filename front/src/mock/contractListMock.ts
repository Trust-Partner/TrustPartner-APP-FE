export type ContractItem = {
  id: number;
  customerName: string; // 고객명
  startDate: string; // 시작일
  endDate: string; // 종료일
  carName: string; // 차량명
  carNumber: string; // 차량번호
};

export const contractListMock: ContractItem[] = [
  {
    id: 1,
    customerName: '임시우',
    startDate: '2025-08-16 09:33',
    endDate: '2025-08-20 14:00',
    carName: '팰리세이드',
    carNumber: '19가3683',
  },
  {
    id: 2,
    customerName: '박지훈',
    startDate: '2025-08-10 13:00',
    endDate: '2025-08-14 09:00',
    carName: '쏘렌토',
    carNumber: '12나5829',
  },
  {
    id: 3,
    customerName: '김도현',
    startDate: '2025-08-01 10:30',
    endDate: '2025-08-05 17:30',
    carName: 'K5',
    carNumber: '58허2910',
  },
];
