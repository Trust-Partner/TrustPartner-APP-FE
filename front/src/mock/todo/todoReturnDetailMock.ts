export type ReturnVehicleItem = {
  id: number;
  name: string;
  plateNumber: string;
  lastUpdate: string;
  duration: string;
  status: '즉시반납' | '고객연락' | '금일회수';
};

export type ReturnCompanyDetail = {
  companyId: number;
  companyName: string;
  vehicles: ReturnVehicleItem[];
};

export const returnCompanyDetailMock: ReturnCompanyDetail[] = [
  {
    companyId: 1,
    companyName: 'kG 모빌리티',
    vehicles: [
      {
        id: 1,
        name: 'K5',
        plateNumber: '84하 1861',
        lastUpdate: '8/31 22:28',
        duration: '18일 11시간',
        status: '즉시반납',
      },
      {
        id: 2,
        name: '쏘렌토',
        plateNumber: '82마 9982',
        lastUpdate: '9/03 14:21',
        duration: '15일 4시간',
        status: '금일회수',
      },
      {
        id: 3,
        name: '아반떼',
        plateNumber: '67조 1124',
        lastUpdate: '9/04 11:11',
        duration: '14일 6시간',
        status: '금일회수',
      },
    ],
  },
];
