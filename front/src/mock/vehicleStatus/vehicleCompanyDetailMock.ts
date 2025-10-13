export type VehicleCompanyDetail = {
  companyId: number;
  companyName: string;
  summary: {
    dispatched: number; // 배차중
    waiting: number; // 대기중
    returning: number; // 반납신청
    total: number; // 전체
  };
  vehicles: {
    id: number;
    name: string;
    plateNumber: string;
    status: '배차중' | '대기중' | '반납신청';
    lastUpdate: string;
    duration: string;
  }[];
};

export const vehicleCompanyDetailMock: VehicleCompanyDetail[] = [
  {
    companyId: 6,
    companyName: '위너스모터스',
    summary: { dispatched: 1, waiting: 4, returning: 1, total: 6 },
    vehicles: [
      {
        id: 1,
        name: 'K3',
        plateNumber: '88허3971',
        status: '배차중',
        lastUpdate: '8/18 04:40',
        duration: '55일 10시간',
      },
      {
        id: 2,
        name: '싼타페',
        plateNumber: '88허5474',
        status: '대기중',
        lastUpdate: '8/20 20:32',
        duration: '52일 18시간',
      },
      {
        id: 3,
        name: 'K9',
        plateNumber: '20허4446',
        status: '대기중',
        lastUpdate: '8/22 12:24',
        duration: '51일 2시간',
      },
      {
        id: 4,
        name: '카니발',
        plateNumber: '92허6378',
        status: '대기중',
        lastUpdate: '8/19 19:31',
        duration: '53일 19시간',
      },
      {
        id: 5,
        name: '셀토스',
        plateNumber: '62허5935',
        status: '대기중',
        lastUpdate: '8/22 22:34',
        duration: '50일 16시간',
      },
      {
        id: 6,
        name: '코나',
        plateNumber: '92허4856',
        status: '반납신청',
        lastUpdate: '8/18 18:30',
        duration: '54일 20시간',
      },
    ],
  },
];
