import { useState, useEffect } from 'react';
import { Dropdown, Button, Spin, MenuProps, message } from 'antd';
import { 
  DisconnectOutlined,
  WalletOutlined,
  CopyOutlined
} from '@ant-design/icons';
// import { useWallet } from '../../hooks/useWallet';
import { useWalletContext } from '../../contexts/WalletContext';
import { ASSET_HUB } from '../../config/networks';
import { StyledDropdown, ConnectButton } from './styles';

export const WalletButton = () => {
  const {
    isConnected,
    isInitializing,
    account,
    balance,
    connectWallet,
    disconnectWallet,
  } = useWalletContext();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    // console.log("change isInitializing:", isInitializing)
    if (isInitializing) {
      
    } else {
      // 添加短暂延迟，避免加载状态闪烁
      // const timer = setTimeout(() => setLocalLoading(false), 300);
      // return () => clearTimeout(timer);
    }
  }, [isInitializing]);

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      const er = error as Error; 
      console.error('WalletButton: 连接钱包失败 ', error);
      message.error(er.message);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(account || '');
    message.success('地址已复制');
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'account',
      label: (
        <div className="wallet-item">
          <WalletOutlined />
          <span>{account?.slice(0, 6)}...{account?.slice(-4)}</span>
        </div>
      ),
      onClick: copyAddress
    },
    {
      key: 'balance',
      label: (
        <div className="wallet-item">
          <span className="balance">{balance} {ASSET_HUB.nativeCurrency.symbol}</span>
        </div>
      )
    },
    {
      type: 'divider',
    },
    {
      key: 'disconnect',
      label: (
        <div className="wallet-item danger">
          <DisconnectOutlined />
          <span>断开连接</span>
        </div>
      ),
      onClick: disconnectWallet
    }
  ];

  if (isInitializing && !isConnected) {
    return (
      <ConnectButton
        type="primary"
        loading={isInitializing}
      >
        正在连接...
      </ConnectButton>
      // <ConnectButton type="primary" >
      //   <Spin size="small" />
      //   正在连接...
      // </ConnectButton>
    );
  }

  if (!isConnected) {
    return (
      <ConnectButton
        type="primary"
        onClick={handleConnect}
        loading={isInitializing}
      >
        连接钱包
      </ConnectButton>
    );
  }

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['click']}
      open={open}
      onOpenChange={setOpen}
    >
      <Button 
        type="primary" 
        className="wallet-btn"
      >
        <WalletOutlined />
        <span className="address">{account?.slice(0, 6)}...{account?.slice(-4)}</span>
      </Button>
    </Dropdown>
  );
};