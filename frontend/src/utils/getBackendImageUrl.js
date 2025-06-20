export const getBackendImageUrl = (imagePath) => {
  if (!imagePath) return null;
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5050";
  return baseUrl + "/" + imagePath;
};
