export const base64ToFile = (
  base64Data: string,
  filename: string,
  mimeType = 'image/png',
) => {
  // data:image/png;base64, 제거
  const base64 = base64Data.replace(/^data:image\/\w+;base64,/, '');

  return {
    uri: `data:${mimeType};base64,${base64}`,
    type: mimeType,
    name: filename,
  };
};
