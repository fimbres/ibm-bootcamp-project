import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as FileSystem from 'expo-file-system';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(fullName?: string): string | undefined {
  return !fullName
    ? undefined
    : fullName
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0]!.toUpperCase())
        .join("");
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

const CLOUDINARY_UPLOAD_PRESET = 'pio-files';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_NAME}/upload`;

export const uploadImageToCloudinary = async (uri: string): Promise<string> => {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const data = new FormData();
  data.append('file', `data:image/jpg;base64,${base64}`);
  data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(CLOUDINARY_URL, {
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  const result = await response.json();

  return result.public_id;
};
