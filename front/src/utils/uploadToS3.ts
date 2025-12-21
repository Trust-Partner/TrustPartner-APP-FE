export const uploadToS3 = async (
  uploadUrl: string,
  file: {
    uri: string;
    type?: string;
  },
) => {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type || 'image/jpeg',
    },
    body: {
      uri: file.uri,
      type: file.type || 'image/jpeg',
      name: 'upload.jpg',
    } as any,
  });

  if (!res.ok) {
    throw new Error('S3 upload failed');
  }
};
