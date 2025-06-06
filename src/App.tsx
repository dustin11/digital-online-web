import { WalletButton } from './components/WalletButton';
import { NetworkInfo } from './components/NetworkInfo';

import { AppContainer, AppHeader, AppContent, AppLogo, MainContent } from './App.styles';

export default function App() {
  return (
    <AppContainer>
      <AppHeader>
        <AppLogo>Asset Hub</AppLogo>
        <WalletButton />
      </AppHeader>
      
      <AppContent>
        <MainContent>
          <NetworkInfo />
          {/* 其他内容 */}
        </MainContent>
      </AppContent>
    </AppContainer>
  );
}