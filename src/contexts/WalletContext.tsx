import { createContext, useContext, ReactNode, useMemo } from 'react';
import { WalletState, useWallet } from '../hooks/useWallet';

// type WalletContextType = WalletState & {
//   connectWallet: () => Promise<void>;
//   disconnectWallet: () => void;
//   checkNetwork: () => boolean;
//   switchNetwork: () => Promise<void>;
// };
type WalletContextType = ReturnType<typeof useWallet>;

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const wallet = useWallet(); // 原有hook逻辑保持不变
  
  // 使用 useMemo 优化上下文值，避免不必要的重新渲染
  // 共享钱包内isInitializing变化状态, 直接传useWallet()不行, 构造个contextValue传递就行了
  const contextValue = useMemo(() => wallet, [
    wallet.provider,
    wallet.signer,
    wallet.account,
    wallet.balance,
    wallet.network,
    wallet.isConnected,
    wallet.isInitializing
  ]);

  return (
    <WalletContext.Provider value={contextValue}>
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