export type ReturnCompany = {
  id: number;
  name: string;
  immediateReturn: number; // 즉시 반납 (빨강)
  contactCustomer: number; // 고객 연락 요청 (초록)
  todayPickup: number; // 금일 회수 요청 (파랑)
};

export type WashFuelCompany = {
  id: number;
  name: string;
  washCount: number;
  fuelCount: number;
};

export const returnRequestList: ReturnCompany[] = [
  {
    id: 1,
    name: 'KG 모빌리티',
    immediateReturn: 1,
    contactCustomer: 0,
    todayPickup: 2,
  },
  {
    id: 2,
    name: '대창',
    immediateReturn: 0,
    contactCustomer: 1,
    todayPickup: 1,
  },
  {
    id: 3,
    name: '노원현대',
    immediateReturn: 2,
    contactCustomer: 0,
    todayPickup: 0,
  },
  {
    id: 4,
    name: '경성 자동차',
    immediateReturn: 0,
    contactCustomer: 1,
    todayPickup: 1,
  },
  {
    id: 5,
    name: '동성',
    immediateReturn: 1,
    contactCustomer: 1,
    todayPickup: 0,
  },
];

export const washFuelList: WashFuelCompany[] = [
  { id: 1, name: '경성 자동차', washCount: 1, fuelCount: 1 },
  { id: 2, name: '렉시온', washCount: 3, fuelCount: 4 },
  { id: 3, name: 'ESA', washCount: 1, fuelCount: 3 },
];
