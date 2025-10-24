import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveDraft = async (type: string, data: any) => {
  try {
    await AsyncStorage.setItem(`draft:${type}`, JSON.stringify(data));
  } catch (e) {
    console.error('임시저장 실패', e);
  }
};

export const loadDraft = async (type: string) => {
  try {
    const json = await AsyncStorage.getItem(`draft:${type}`);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('임시저장 불러오기 실패', e);
    return null;
  }
};
