import styled from 'styled-components';
import { Card, Alert, Typography } from 'antd';

export const StyledCard = styled(Card)`
  && {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .ant-card-head {
      border-bottom: 1px solid #f0f0f0;
      padding: 0 16px;

      .ant-card-head-title {
        font-weight: 600;
        color: #1890ff;
      }
    }

    .ant-card-body {
      padding: 16px 24px;
    }
  }
`;

export const NetworkStatusWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const NetworkItem = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

export const NetworkLabel = styled(Typography.Text)`
  color: #666;
  font-size: 14px;
`;

export const NetworkValue = styled(Typography.Text)`
  font-weight: 500;
  color: #333;
  word-break: break-all;
`;

export const NetworkAlert = styled(Alert)`
  && {
    border-radius: 6px;
    margin-top: 16px;

    .ant-alert-message {
      font-weight: 500;
      color: #d48806;
    }

    .ant-alert-description {
      margin-top: 4px;
      color: #d48806;
    }
  }
`;

export const SwitchButton = styled.button`
  background: none;
  border: none;
  color: #1890ff;
  cursor: pointer;
  padding: 0;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }

  &:active {
    opacity: 0.6;
  }
`;