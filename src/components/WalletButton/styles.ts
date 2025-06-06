import { Button } from 'antd';
import styled from 'styled-components';


export const ConnectButton = styled(Button)`
  &.ant-btn {
    background: #1890ff;
    border-radius: 20px;
    padding: 0 24px;
    height: 40px;
    font-weight: 500;
  }
`;

export const StyledDropdown = styled.div`
  .wallet-item {
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s;
    
    .anticon {
      font-size: 16px;
    }
    
    &.danger {
      color: #ff4d4f;
    }
    
    .balance {
      color: #52c41a;
      font-weight: 500;
    }
    
    &:hover {
      background: #f5f5f5;
    }
  }
  
  .ant-dropdown-menu-item-divider {
    margin: 8px 0;
  }
`;

export const WalletButtonWrapper = styled.div`
  .wallet-btn {
    background: #1890ff;
    border-radius: 20px;
    padding: 0 20px;
    height: 40px;
    
    .address {
      margin-left: 8px;
    }
    
    &:hover {
      background: #40a9ff;
    }
  }
`;