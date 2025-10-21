export type PartnerStat = {
  month: string;
  sales: number;
  count: number;
};

export type PartnerInfo = {
  id: number;
  name: string;
  grade: string;
  share: number;
  phone: string;
  address: string;
  manager: string;
};

export const partnerStats: PartnerStat[] = [
  { month: '25.08', sales: 165000000, count: 329 },
  { month: '25.07', sales: 159000000, count: 315 },
  { month: '25.06', sales: 147000000, count: 280 },
  { month: '25.05', sales: 153000000, count: 294 },
  { month: '25.04', sales: 138000000, count: 252 },
  { month: '25.03', sales: 144000000, count: 266 },
  { month: '25.02', sales: 126000000, count: 224 },
  { month: '25.01', sales: 135000000, count: 245 },
];

export const partnerList: PartnerInfo[] = [
  {
    id: 1,
    name: '한라',
    grade: '1등급',
    share: 27,
    phone: '010-7561-8521',
    address: '성동구 성수이로 909',
    manager: '정현수 회장',
  },
  {
    id: 2,
    name: '한독',
    grade: '2등급',
    share: 24,
    phone: '010-5210-8796',
    address: '강남구 테헤란로 122',
    manager: '김진수 대표',
  },
  {
    id: 3,
    name: '모든자동차',
    grade: '3등급',
    share: 22,
    phone: '010-1123-4748',
    address: '서초구 반포대로 223',
    manager: '이성민 부장',
  },
  {
    id: 4,
    name: '홍명',
    grade: '4등급',
    share: 21,
    phone: '010-9801-1553',
    address: '송파구 올림픽로 345',
    manager: '박진우 대표',
  },
  {
    id: 5,
    name: '세림모터스',
    grade: '1등급',
    share: 27,
    phone: '010-2421-1165',
    address: '부산광역시 수영구 광안로 201',
    manager: '이준혁 대표',
  },
  {
    id: 6,
    name: '신흥렌트카',
    grade: '2등급',
    share: 24,
    phone: '010-8853-9231',
    address: '서울특별시 강동구 천호대로 617',
    manager: '강은호 부장',
  },
  {
    id: 7,
    name: '오토메카',
    grade: '3등급',
    share: 22,
    phone: '010-6322-5811',
    address: '인천광역시 미추홀구 경인로 215',
    manager: '박상현 과장',
  },
  {
    id: 8,
    name: '대신렌트',
    grade: '4등급',
    share: 21,
    phone: '010-9123-7534',
    address: '대전광역시 유성구 온천로 118',
    manager: '노성진 실장',
  },
  {
    id: 9,
    name: '스마트카',
    grade: '5등급',
    share: 20,
    phone: '010-3812-5461',
    address: '광주광역시 서구 화정로 321',
    manager: '한세라 매니저',
  },
  {
    id: 10,
    name: '명진오토',
    grade: '2등급',
    share: 24,
    phone: '010-1290-8834',
    address: '경기도 안양시 동안구 관악대로 85',
    manager: '정재욱 대표',
  },
  {
    id: 11,
    name: '탑모빌',
    grade: '1등급',
    share: 27,
    phone: '010-6631-3345',
    address: '서울특별시 용산구 한강대로 412',
    manager: '최민석 부장',
  },
  {
    id: 12,
    name: '리더스렌트',
    grade: '3등급',
    share: 22,
    phone: '010-8888-9021',
    address: '경기도 수원시 영통구 광교로 122',
    manager: '오지훈 차장',
  },
  {
    id: 13,
    name: '우성자동차',
    grade: '4등급',
    share: 21,
    phone: '010-7712-5020',
    address: '부산광역시 남구 용소로 64',
    manager: '임성빈 대표',
  },
  {
    id: 14,
    name: '동원모터스',
    grade: '5등급',
    share: 20,
    phone: '010-2131-6565',
    address: '대구광역시 수성구 들안로 77',
    manager: '박진태 팀장',
  },
  {
    id: 15,
    name: '제일렌트카',
    grade: '2등급',
    share: 24,
    phone: '010-5122-8899',
    address: '울산광역시 남구 삼산로 91',
    manager: '송혜린 매니저',
  },
];
