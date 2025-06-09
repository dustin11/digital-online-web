import { useEffect, useState, useCallback } from 'react';
import { BrowserProvider, JsonRpcSigner, Network, EthersError } from 'ethers';
import { ASSET_HUB, SUPPORTED_CHAINS } from '../config/networks';
import { message } from 'antd';
import { getErrorByStr } from '../utils/errorUtils';

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
    } catch (e) {
      setState(prev => ({ ...prev, isConnected: false, isInitializing: false }));
      
      const error = e as EthersError;
      if ((typeof error.code === 'number' && error.code === 4001)) {// User rejected the request
        disconnectWallet();
      }
      else if ((typeof error.code === 'number' && error.code === -32002)) {        
        message.error('请先完成钱包弹窗操作');
      }
      // error哪个垃圾被包装成: could not coalesce error (error={ "code": -32002, "payload": { "method": "eth_requestAccounts", "params": [  ] } }, payload={ "method": "eth_requestAccounts", "params": [  ] }, code=UNKNOWN_ERROR, version=6.14.1)
      // 没法直接获取code 应该是rpc 改为钱包连接时处理
      const code = getErrorByStr(e + "", 1);
      if(code === -32002)
        message.error('请先完成钱包弹窗操作');
      // else{
      //  throw new Error(`初始化失败: ${error.message || '未知错误'}`);
      // }
      console.error('initiallize error:', e);      
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
      throw error;
    }
  }, [initialize]);


  const disconnectWallet = useCallback(async() => {
    localStorage.setItem(ManualDisConKey, 'true');
    setState({ isConnected: false, isInitializing: false });
    // 标准断开方法 (EIP-2255) ok不支持
    if (window.ethereum?.request) {
      try {
        await window.ethereum.request({
          method: 'wallet_revokePermissions',
          params: [{
            eth_accounts: {}
          }]
        });
      } catch (error) {
        console.log('钱包不支持主动断开:', error);
      }
    }

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

  const handleDisconnect = (error: { code: number; message: string }) => {
    console.error('钱包断开连接:', error);
    disconnectWallet();
  };

  useEffect(() => {
    const handleAccountsChanged = () => initialize();
    const handleChainChanged = () => initialize();
    window.ethereum?.on('accountsChanged', handleAccountsChanged);
    window.ethereum?.on('chainChanged', handleChainChanged);
    // 点击钱包断开, ok可触发 meatmask不行
    window.ethereum?.on('disconnect', handleDisconnect);
    // state.provider?.on('disconnect', handleDisconnect);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
      window.ethereum?.removeListener('disconnect', handleDisconnect);
      // state.provider?.removeListener('disconnect', handleDisconnect);
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