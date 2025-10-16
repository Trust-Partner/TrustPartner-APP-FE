export type AlertItem = {
  id: number;
  message: string;
  time: string;
  read: boolean;
};

export const alertMock: AlertItem[] = [
  {
    id: 1,
    message: '고객차량 그랜저 배차요청 되었습니다.',
    time: '15분 전',
    read: false,
  },
  {
    id: 2,
    message: '요청하신 차량을 배차하였습니다. (고객차량 G90)',
    time: '30분 전',
    read: false,
  },
  {
    id: 3,
    message: '제네시스(789호 1234) 즉시 회수요청 되었습니다.',
    time: '45분 전',
    read: false,
  },
  {
    id: 4,
    message: 'K5 차량(234하 5678)이 금일 내로 회수됩니다.',
    time: '60분 전',
    read: false,
  },
  {
    id: 5,
    message: '매니저공업사에 소나타(456마 7890) 배치되었습니다.',
    time: '75분 전',
    read: false,
  },
  {
    id: 6,
    message: '이기상 담당자가 15분 이내로 도착 예정입니다.',
    time: '90분 전',
    read: false,
  },
  {
    id: 7,
    message: '차량 점검 일정이 등록되었습니다.',
    time: '어제',
    read: true,
  },
  {
    id: 8,
    message: '고객차량 아반떼 배차요청 되었습니다.',
    time: '2일 전',
    read: true,
  },
];
