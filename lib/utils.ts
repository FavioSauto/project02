import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (typeof error === 'string' && error.length > 0) {
    return error;
  }
  if (error instanceof Error && typeof error.message === 'string' && error.message.length > 0) {
    return error.message;
  }
  if (
    typeof (error as { message?: unknown })?.message === 'string' &&
    ((error as { message?: unknown }).message as string).length > 0
  ) {
    return (error as { message?: string }).message as string;
  }
  return fallbackMessage;
}
