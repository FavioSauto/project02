'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StoreProvider } from '@/providers/store/provider';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

export function GlobalProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>{children}</StoreProvider>
    </QueryClientProvider>
  );
}
