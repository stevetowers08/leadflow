/**
 * Utility functions for handling company logos
 */

export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url || url.trim() === "") return false;
  
  // Check if it's a valid URL format
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getImageExtension = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const extension = pathname.split('.').pop()?.toLowerCase();
    return extension || '';
  } catch {
    return '';
  }
};

export const isImageUrl = (url: string): boolean => {
  const extension = getImageExtension(url);
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  return imageExtensions.includes(extension);
};

export const testImageLoad = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

export const getCompanyInitial = (companyName: string | null | undefined): string => {
  if (!companyName) return "C";
  return companyName.charAt(0).toUpperCase();
};

export const getCompanyLogoFallback = (companyName: string | null | undefined): string => {
  const initial = getCompanyInitial(companyName);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName || 'Company')}&background=random&color=fff&size=40&bold=true&format=png`;
};

