export type Reservation = {
  id: number;
  date: string;
  time: string;
  carName: string;
  manager: string;
  requester: string;
  rentalCompany: string;
  dispatchLocation: string;
};

export type ReservationSummary = {
  todayLeft: number;
  totalLeft: number;
};

export type ReservationResponse = {
  summary: ReservationSummary;
  list: Reservation[];
};

export const reservationMock: ReservationResponse = {
  summary: {
    todayLeft: 6,
    totalLeft: 13,
  },
  list: [
    {
      id: 1,
      date: '2025-09-01',
      time: '18:30',
      carName: '스포티지',
      manager: '서승동',
      requester: '김종민',
      rentalCompany: '대성',
      dispatchLocation: '경남아파트',
    },
    {
      id: 2,
      date: '2025-09-03',
      time: '10:00',
      carName: '소나타',
      manager: '서승동',
      requester: '이정훈',
      rentalCompany: '현대렌트카',
      dispatchLocation: 'e편한세상',
    },
    {
      id: 3,
      date: '2025-09-09',
      time: '14:00',
      carName: '그랜저',
      manager: '서승동',
      requester: '김진우',
      rentalCompany: '렉시온',
      dispatchLocation: '강남 더 힐',
    },
    {
      id: 4,
      date: '2025-09-11',
      time: '09:30',
      carName: '아반떼',
      manager: '서승동',
      requester: '박성민',
      rentalCompany: '대성렌트카',
      dispatchLocation: '출근용',
    },
    {
      id: 5,
      date: '2025-09-22',
      time: '16:00',
      carName: 'K5',
      manager: '서승동',
      requester: '한유진',
      rentalCompany: '렉시온',
      dispatchLocation: '블래싱',
    },
    {
      id: 6,
      date: '2025-09-23',
      time: '16:00',
      carName: 'K5',
      manager: '서승동',
      requester: '한유진',
      rentalCompany: '렉시온',
      dispatchLocation: '대창',
    },
    {
      id: 7,
      date: '2025-10-02',
      time: '16:00',
      carName: '소나타',
      manager: '서승동',
      requester: '이채연',
      rentalCompany: '현대렌트가',
      dispatchLocation: '00아파트',
    },
    {
      id: 8,
      date: '2025-10-23',
      time: '12:00',
      carName: '소나타',
      manager: '서승동',
      requester: '김재민',
      rentalCompany: '대성모터스',
      dispatchLocation: '00아파트',
    },
    {
      id: 9,
      date: '2025-10-23',
      time: '12:00',
      carName: '소나타',
      manager: '서승동',
      requester: '김재민',
      rentalCompany: '대성모터스',
      dispatchLocation: '00아파트',
    },
    {
      id: 10,
      date: '2025-10-23',
      time: '12:00',
      carName: '아반떼',
      manager: '서승동',
      requester: '김재민',
      rentalCompany: '대성모터스',
      dispatchLocation: '00아파트',
    },
    {
      id: 11,
      date: '2025-10-23',
      time: '12:00',
      carName: '그렌저',
      manager: '서승동',
      requester: '김재민',
      rentalCompany: '대성모터스',
      dispatchLocation: '00아파트',
    },
    {
      id: 12,
      date: '2025-10-23',
      time: '12:00',
      carName: 'SM5',
      manager: '서승동',
      requester: '김재민',
      rentalCompany: '대성모터스',
      dispatchLocation: '00아파트',
    },
    {
      id: 13,
      date: '2025-10-23',
      time: '12:00',
      carName: 'K5',
      manager: '서승동',
      requester: '김재민',
      rentalCompany: '대성모터스',
      dispatchLocation: '00아파트',
    },
  ],
};
