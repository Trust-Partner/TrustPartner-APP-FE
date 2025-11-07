export type DispatchStatus = 'active' | 'cancelled';

export interface DispatchRequest {
  id: string;
  company: string;
  model: string;
  time: string;
  status: DispatchStatus;
  year?: string;
  displacement?: string;
  isReplacement?: boolean;
}

export const mockDispatchRequests: DispatchRequest[] = [
  {
    id: '1',
    company: '한라',
    model: '카니발',
    year: '4년이내',
    displacement: '1601~2000cc',
    time: '8/31 22:28',
    status: 'active',
    isReplacement: false,
  },
  {
    id: '2',
    company: '경성자동차',
    model: '투싼',
    time: '8/31 22:28',
    status: 'active',
    isReplacement: true,
  },
  {
    id: '3',
    company: '북서울렉카',
    model: '쏘렌토',
    time: '8/31 22:28',
    status: 'active',
    isReplacement: true,
  },
  {
    id: '4',
    company: '북서울렉카',
    model: '스포티지',
    year: '4년이내',
    displacement: '1601~2000cc',
    time: '8/31 22:28',
    status: 'cancelled',
    isReplacement: false,
  },
  {
    id: '5',
    company: '북서울렉카',
    model: '그랜저',
    year: '4년이내',
    displacement: '1601~2000cc',
    time: '8/31 22:28',
    status: 'cancelled',
    isReplacement: false,
  },
  {
    id: '6',
    company: '한라',
    model: '소나타',
    year: '4년이내',
    displacement: '1601~2000cc',
    time: '8/31 22:28',
    status: 'cancelled',
    isReplacement: false,
  },
];
