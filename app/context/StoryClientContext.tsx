'use client';

import React, { createContext, useContext } from 'react';
import { Client, ReadOnlyClient, StoryClient, StoryConfig, StoryReadOnlyConfig } from '@story-protocol/core-sdk';
import { http } from 'viem';
import { mainnet, sepolia, useWalletClient } from 'wagmi';

interface StoryClientContextType {
  client: ReadOnlyClient | Client;
}

const StoryClientContext = createContext<StoryClientContextType | null>(null);

export const useStoryClientContext = () => {
  const context = useContext(StoryClientContext);

  if (context === null) {
    throw new Error('useStoryClientContext must be used within a StoryClientProvider');
  }

  return context;
};

export const StoryClientProvider = ({ children }: { children: React.ReactNode }) => {
  let client;
  // const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();
  // const { isConnected } = useAccount();
  if (walletClient) {
    const config = {
      // chain: process.env.NEXT_PUBLIC_ENV === 'production' ? mainnet : sepolia,
      chain: mainnet,
      transport: http(process.env.RPC_PROVIDER_URL),
      account: walletClient!.account,
    } as StoryConfig;
    client = StoryClient.newClient(config);
  }

  const readOnlyConfig = {
    // chain: process.env.NEXT_PUBLIC_ENV === 'production' ? mainnet : sepolia,
    chain: mainnet,
    transport: http(process.env.RPC_PROVIDER_URL),
    ...(walletClient && { account: walletClient!.account }),
  } as StoryReadOnlyConfig;

  client = StoryClient.newReadOnlyClient(readOnlyConfig);

  console.log('Client: ', client);
  return <StoryClientContext.Provider value={{ client }}>{children}</StoryClientContext.Provider>;
};
