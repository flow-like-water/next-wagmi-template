'use client';

import React, { ReactNode } from 'react';
import { wagmiConfig, projectId } from '@/blockchain/config';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { State, WagmiProvider } from 'wagmi';

const queryClient = new QueryClient();

if (!projectId) throw new Error('Project ID is not defined');

createWeb3Modal({
  wagmiConfig,
  projectId,
  themeMode: 'dark',
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
  chainImages: {
    369: '/pulse.png',
  },
  themeVariables: {
    '--w3m-font-family': 'Montserrat, sans-serif',
    '--w3m-accent': '#4f46e5',
    '--w3m-border-radius-master': 0,
  },
});

export function Web3Modal({ children, initialState }: { children: ReactNode; initialState?: State }) {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
