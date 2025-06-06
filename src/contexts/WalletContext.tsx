import { createContext, useContext, ReactNode } from 'react';
import { BrowserProvider, JsonRpcSigner, Network } from 'ethers';
import { useWallet } from '../hooks/useWallet';

type WalletContextType = {
  provider?: BrowserProvider;
  signer?: JsonRpcSigner;
  account?: string;
  balance?: string;
  network?: Network;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  checkNetwork: () => boolean;
  switchNetwork: () => Promise<void>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const wallet = useWallet(); // 原有hook逻辑保持不变
  
  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};