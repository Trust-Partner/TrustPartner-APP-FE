// users.ts
import type { Role } from './../states/useAuthStore';

export const mockUsers: {
  username: string;
  password: string;
  name: string;
  role: Role;
}[] = [
  { username: 'sd1234', password: 'sd1234', role: 'admin', name: '서승동' },
  { username: 'hr1234', password: 'hr1234', role: 'user', name: '입고 공업사' },
  {
    username: 'anbg1234',
    password: 'anbg1234',
    role: 'user',
    name: '요청업체',
  },
];
