export const mockAdminDashboard = {
  summary: {
    top: [
      { label: '회전율', value: '66%' },
      { label: '8월 배차', value: '329건' },
    ],
    middle: [
      { label: '배차중', value: 73 },
      { label: '대기중', value: 35 },
      { label: '반납신청', value: 3 },
    ],
    bottom: [
      { value: 9, label: '배차요청건', sub: '처리대기 요청' },
      { value: 3, label: '반납신청', sub: '반납 처리' },
      { value: 3, label: '지급확정', sub: '지급대기 확인' },
      { value: 0, label: '예약관리', sub: '오늘 남은 예약' },
      { value: 5, label: '세차/주유', sub: '차량 관리' },
    ],
  },
  alerts: [
    {
      id: 1,
      message: '고객차량 그랜저 배차요청 되었습니다.',
      time: '15분 전',
    },
    {
      id: 2,
      message: '요청하신 차량을 배차하였습니다. (고객차량 G90)',
      time: '30분 전',
    },
    {
      id: 3,
      message: '제네시스(789호 1234) 즉시 회수요청 되었습니다.',
      time: '45분 전',
    },
    {
      id: 4,
      message: 'K5 차량(234하 5678)이 금일 내로 회수됩니다.',
      time: '60분 전',
    },
    {
      id: 5,
      message: '매니저공업사에 소나타(456마 7890) 배치되었습니다.',
      time: '75분 전',
    },
    {
      id: 6,
      message: '이기상 담당자가 15분 이내로 도착 예정입니다.',
      time: '90분 전',
    },
  ],
};
