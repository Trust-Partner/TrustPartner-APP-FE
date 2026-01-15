import { Platform } from 'react-native';

export type DeviceType = 'ANDROID' | 'IOS';

export const getDeviceType = (): DeviceType =>
  Platform.OS === 'ios' ? 'IOS' : 'ANDROID';
