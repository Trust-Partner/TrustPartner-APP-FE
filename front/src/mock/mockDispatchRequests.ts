export type DispatchStatus = 'active' | 'cancelled';

export interface DispatchRequest {
  id: string;
  company: string;
  label?: string;
  model: string;
  time: string;
  status: DispatchStatus;
}

export const mockDispatchRequests: DispatchRequest[] = [
  {
    id: '1',
    company: '한라',
    model: '카니발',
    time: '8/31 22:28',
    status: 'active',
  },
  {
    id: '2',
    company: '경성자동차',
    label: '교체건',
    model: '투싼',
    time: '8/31 22:28',
    status: 'active',
  },
  {
    id: '3',
    company: '북서울렉카',
    label: '교체건',
    model: '쏘렌토',
    time: '8/31 22:28',
    status: 'active',
  },
  {
    id: '4',
    company: '북서울렉카',
    model: '스포티지',
    time: '8/31 22:28',
    status: 'cancelled',
  },
  {
    id: '5',
    company: '북서울렉카',
    model: '그랜저',
    time: '8/31 22:28',
    status: 'cancelled',
  },
  {
    id: '6',
    company: '한라',
    model: '소나타',
    time: '8/31 22:28',
    status: 'cancelled',
  },
];
