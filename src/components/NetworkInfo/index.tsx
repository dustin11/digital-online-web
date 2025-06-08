import { Card, Alert } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
// import { useWallet } from '../../hooks/useWallet';
import { useWalletContext } from '../../contexts/WalletContext';
import { ASSET_HUB } from '../../config/networks';
import {
    StyledCard,
    NetworkStatusWrapper,
    NetworkItem,
    NetworkLabel,
    NetworkValue,
    NetworkAlert,
    SwitchButton
  } from './styles';

export const NetworkInfo = () => {
  const { network, checkNetwork, switchNetwork } = useWalletContext();

  if (!network) return null;

  const isCorrectNetwork = checkNetwork();

  return (
    <StyledCard title="网络信息">
      <NetworkStatusWrapper>
        <NetworkItem>
          <NetworkLabel>网络名称:</NetworkLabel>
          <NetworkValue>{network.name}</NetworkValue>
        </NetworkItem>
        <NetworkItem>
          <NetworkLabel>
          <button onClick={() => console.log('localStorage', localStorage.getItem('disCon'))}>
            get storage
          </button>
          <button onClick={() => localStorage.setItem('disCon', 'false')}>
            set storage
          </button>
          工式:
          </NetworkLabel>
          <NetworkValue>{network.name}</NetworkValue>
        </NetworkItem>

        
        <NetworkItem>
          <NetworkLabel>链ID:</NetworkLabel>
          <NetworkValue>{network.chainId.toString()}</NetworkValue>
        </NetworkItem>

        {!isCorrectNetwork && (
          <NetworkAlert
            type="warning"
            message="网络不匹配"
            description={
              <SwitchButton onClick={switchNetwork}>
                切换到 {ASSET_HUB.chainName}
              </SwitchButton>
            }
          />
        )}
      </NetworkStatusWrapper>
    </StyledCard>
  );
};