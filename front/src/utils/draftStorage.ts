import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveDraft = async (type: string, vehicleId: string, data: any) => {
  const key = `draft_${type}_${vehicleId}`;
  await AsyncStorage.setItem(key, JSON.stringify(data));
};

export const loadDraft = async (type: string, vehicleId: string) => {
  const key = `draft_${type}_${vehicleId}`;
  const saved = await AsyncStorage.getItem(key);
  return saved ? JSON.parse(saved) : null;
};

export const removeDraft = async (type: string, vehicleId: string) => {
  const key = `draft_${type}_${vehicleId}`;
  await AsyncStorage.removeItem(key);
};
