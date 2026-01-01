import RNFS from 'react-native-fs';

export const saveBase64ToTempFile = async (base64: string): Promise<string> => {
  const filePath = `${RNFS.CachesDirectoryPath}/signature_${Date.now()}.png`;
  const pureBase64 = base64.replace(/^data:image\/\w+;base64,/, '');

  await RNFS.writeFile(filePath, pureBase64, 'base64');
  return `file://${filePath}`;
};
