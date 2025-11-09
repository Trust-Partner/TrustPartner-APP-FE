export interface ReturnRequestCompany {
  id: number;
  name: string;
  totalCount: number; // 주차된 차량 수
  immediateReturn: number; // 즉시 반납
  contactCustomer: number; // 고객 연락 필요
  todayPickup: number; // 금일 회수 요청
  unprocessedPrevDay: boolean; // 전일 미처리건 여부
}

export interface WashFuelCompany {
  id: number;
  name: string;
  totalCount: number; // 주차된 차량 수
  washCount: number; // 세차
  fuelCount: number; // 주유
  unprocessedPrevDay: boolean; // 전일 미처리건 여부
  isParkingLot: boolean; // 주차장 여부
}

export const returnRequestList: ReturnRequestCompany[] = [
  {
    id: 1,
    name: 'KG 모빌리티',
    totalCount: 7,
    immediateReturn: 2,
    contactCustomer: 0,
    todayPickup: 1,
    unprocessedPrevDay: false,
  },
  {
    id: 2,
    name: '대창렌터카',
    totalCount: 5,
    immediateReturn: 0,
    contactCustomer: 1,
    todayPickup: 0,
    unprocessedPrevDay: true,
  },
  {
    id: 3,
    name: 'AJ렌터카',
    totalCount: 8,
    immediateReturn: 0,
    contactCustomer: 0,
    todayPickup: 0,
    unprocessedPrevDay: false,
  },
  {
    id: 4,
    name: '하이렌터카',
    totalCount: 3,
    immediateReturn: 0,
    contactCustomer: 0,
    todayPickup: 0,
    unprocessedPrevDay: false,
  },
  {
    id: 5,
    name: '롯데렌터카',
    totalCount: 6,
    immediateReturn: 1,
    contactCustomer: 1,
    todayPickup: 0,
    unprocessedPrevDay: false,
  },
];

export const washFuelList: WashFuelCompany[] = [
  {
    id: 1,
    name: '경성자동차',
    totalCount: 5,
    washCount: 2,
    fuelCount: 1,
    unprocessedPrevDay: false,
    isParkingLot: true,
  },
  {
    id: 2,
    name: '렉시온',
    totalCount: 10,
    washCount: 3,
    fuelCount: 4,
    unprocessedPrevDay: true,
    isParkingLot: false,
  },
  {
    id: 3,
    name: 'ESA',
    totalCount: 3,
    washCount: 1,
    fuelCount: 0,
    unprocessedPrevDay: false,
    isParkingLot: false,
  },
  {
    id: 4,
    name: '대성모터스',
    totalCount: 2,
    washCount: 0,
    fuelCount: 0,
    unprocessedPrevDay: false,
    isParkingLot: false,
  },
  {
    id: 5,
    name: '탑모터스',
    totalCount: 6,
    washCount: 0,
    fuelCount: 2,
    unprocessedPrevDay: false,
    isParkingLot: true,
  },
];
