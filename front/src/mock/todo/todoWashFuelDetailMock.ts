export type WashFuelVehicle = {
  id: number;
  name: string;
  plateNumber: string;
  lastUpdate: string;
  duration: string;
  hasWash: boolean; // 세차 필요 여부
  hasFuel: boolean; // 주유 필요 여부
};

export type WashFuelCompanyDetail = {
  companyId: number;
  companyName: string;
  vehicles: WashFuelVehicle[];
};

export const washFuelCompanyDetailMock: WashFuelCompanyDetail[] = [
  {
    companyId: 1,
    companyName: 'ESA',
    vehicles: [
      {
        id: 1,
        name: 'K5',
        plateNumber: '84하 1861',
        lastUpdate: '8/31 22:28',
        duration: '18일 11시간',
        hasWash: true,
        hasFuel: true,
      },
      {
        id: 2,
        name: '쏘렌토',
        plateNumber: '82마 9982',
        lastUpdate: '9/01 14:12',
        duration: '15일 7시간',
        hasWash: true,
        hasFuel: false,
      },
      {
        id: 3,
        name: '아반떼',
        plateNumber: '68호 1123',
        lastUpdate: '9/02 09:43',
        duration: '14일 5시간',
        hasWash: false,
        hasFuel: true,
      },
    ],
  },
];
