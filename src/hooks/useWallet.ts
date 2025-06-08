import { useEffect, useState, useCallback } from 'react';
import { BrowserProvider, JsonRpcSigner, Network } from 'ethers';
import { ASSET_HUB, SUPPORTED_CHAINS } from '../config/networks';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export type WalletState = {
  provider?: BrowserProvider;
  signer?: JsonRpcSigner;
  account?: string;
  balance?: string;
  network?: Network;
  isConnected: boolean;
  isInitializing: boolean;
  // checkNetwork?: () => boolean;
};
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 添加初始化状态锁
const ManualDisConKey = 'm-dis-con';

export const useWallet = () => {
  const [state, setState] = useState<WalletState>({ isConnected: false, isInitializing: false });

  const initialize = useCallback(async () => {
    const isManuallyDisconnected = localStorage.getItem(ManualDisConKey) === 'true' ? true : false;
    // 添加isInitialized防止重复初始化 (多处使用usewallet即使用WalletContext也会重复执行)
    // 如果只使用初始状态, 不使用alletContext, 多个组件只能一个加载到信息
    if (state.isInitializing || isManuallyDisconnected || !window.ethereum) return;
    setState(prev => ({ ...prev, isInitializing: true }));
    // console.log("......  start isInitializing:", state.isInitializing)

    try {
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      const balance = await provider.getBalance(account);
      // await sleep(2000);
      console.log('initialize network id:', network.chainId); 
      setState({
        provider,
        signer,
        account,
        balance: formatBalance(balance),
        network,
        isConnected: true,
        isInitializing: false,
      });
      // await sleep(1000);
      // console.log("......  end isInitializing:", state.isInitializing)
    } catch (error) {
      setState(prev => ({ ...prev, isConnected: false, isInitializing: false }));
      console.error('initiallize error:', error);
    }
  }, []);
  // 目前场景为手动连接钱包
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) throw new Error('Wallet not detected');
    localStorage.setItem(ManualDisConKey, 'false');
    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      return initialize();
    } catch (error) {
      throw new Error('Connection failed');
    }
  }, [initialize]);

  const disconnectWallet = useCallback(() => {
    localStorage.setItem(ManualDisConKey, 'true');
    setState({ isConnected: false, isInitializing: false });
  }, []);

  const checkNetwork = useCallback(() => {
    if (!state.network) return false;
    console.log(`checkNetwork network id: ${state.network.chainId} name: ${state.network.name}`);
    return state.network.chainId === BigInt(parseInt(ASSET_HUB.chainId, 16));
  }, [state.provider]);

  const switchNetwork = useCallback(async () => {
    try {
      await window.ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [ASSET_HUB]
      });
    } catch (error) {
      console.error('Network switch failed:', error);
      // throw new Error(`Network switch rejected: ${(error as Error).message}`);
    }
  }, []);

  useEffect(() => {
    const handleAccountsChanged = () => initialize();
    const handleChainChanged = () => initialize();
    window.ethereum?.on('accountsChanged', handleAccountsChanged);
    window.ethereum?.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [initialize]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    checkNetwork,
    switchNetwork
  };
};

const formatBalance = (balance: bigint) => {
  return (Number(balance) / 10 ** ASSET_HUB.nativeCurrency.decimals).toFixed(4);
};