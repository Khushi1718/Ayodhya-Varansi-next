export async function uploadImageToCloudinary(file: File, folder: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data?.success || !data?.url) {
    throw new Error(data?.error || `Upload failed with HTTP ${response.status}`);
  }

  return data.url as string;
}