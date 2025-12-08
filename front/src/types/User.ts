// 관리자 유저 타입
export interface AdminUser {
  kind: 'ADMIN';

  staffId: string;
  name: string;

  role: {
    code: string;
    description: string;
  };

  branch: string;
  loginId: string;
  phoneNumber: string;
  enabled: boolean;
}

// 파트너 유저 타입
export interface PartnerUser {
  kind: 'USER';

  partnerId: string;
  name: string;

  role: {
    code: string;
    description: string;
  };

  branch: string;
  loginId: string;
  phoneNumber: string;
  enabled: boolean;

  address?: string;
  gradeName?: string;
}

// 통합 유저 타입
export type User = AdminUser | PartnerUser;
