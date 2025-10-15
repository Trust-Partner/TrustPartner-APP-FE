export type TodoCompany = {
  id: number;
  name: string;
  washCount: number;
  fuelCount: number;
};

// 반납신청 목록
export const returnRequestList: TodoCompany[] = [
  { id: 1, name: 'KG 모빌리티', washCount: 1, fuelCount: 0 },
  { id: 2, name: '대창', washCount: 0, fuelCount: 1 },
  { id: 3, name: '노원현대', washCount: 1, fuelCount: 0 },
  { id: 4, name: '경성 자동차', washCount: 1, fuelCount: 0 },
  { id: 5, name: '동성', washCount: 1, fuelCount: 0 },
  { id: 6, name: '위너스모터스', washCount: 1, fuelCount: 1 },
];

// 세차/주유 목록
export const washFuelList: TodoCompany[] = [
  { id: 7, name: '경성 자동차', washCount: 1, fuelCount: 1 },
  { id: 8, name: '렉시온', washCount: 3, fuelCount: 4 },
  { id: 9, name: 'ESA', washCount: 1, fuelCount: 3 },
];
