import styled from 'styled-components';
import { Layout } from 'antd';

const { Header, Content } = Layout;

export const AppContainer = styled(Layout)`
  min-height: 100vh;
  background: #f8f9fa;
`;

export const AppHeader = styled(Header)`
  && {
    background: #fff;
    padding: 0 24px;
    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1;
  }
`;

export const AppLogo = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #1890ff;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

export const AppContent = styled(Content)`
  && {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
`;

export const MainContent = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;