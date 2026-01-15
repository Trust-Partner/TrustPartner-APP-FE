import messaging from '@react-native-firebase/messaging';

export async function getFcmToken(): Promise<string> {
  try {
    const token = await messaging().getToken();
    return token ?? '';
  } catch (e) {
    console.warn('FCM token fetch failed', e);
    return '';
  }
}
