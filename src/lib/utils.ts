import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  return `${hours}h ${mins}m`;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function getTimeDifference(start: Date, end?: Date): number {
  const endTime = end || new Date();
  return Math.floor((endTime.getTime() - start.getTime()) / (1000 * 60));
}

export async function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
  address?: string;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no soportada'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding using a free service
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es`
          );
          const data = await response.json();
          
          resolve({
            latitude,
            longitude,
            address: data.display_name || `${latitude}, ${longitude}`,
          });
        } catch {
          resolve({ latitude, longitude });
        }
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  });
}

export async function captureScreenshot(): Promise<string> {
  const html2canvas = (await import('html2canvas')).default;
  
  const canvas = await html2canvas(document.body, {
    height: window.innerHeight,
    width: window.innerWidth,
    scrollX: 0,
    scrollY: 0,
  });
  
  return canvas.toDataURL('image/jpeg', 0.8);
}