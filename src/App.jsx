import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MobileAppShell } from './components/MobileAppShell';
import { LoginScreen } from './components/LoginScreen';
import { RegistrationScreen } from './components/RegistrationScreen';
import { CitizenScreen } from './components/CitizenScreen';
import { GrassrootsScreen } from './components/GrassrootsScreen';
import { MlaScreen } from './components/MlaScreen';

const MainRouter = () => {
  const { currentRole } = useApp();

  return (
    <MobileAppShell>
      {currentRole === 'LOGIN' && <LoginScreen />}
      {currentRole === 'REGISTER' && <RegistrationScreen />}
      {currentRole === 'RESIDENT' && <CitizenScreen />}
      {currentRole === 'GRASSROOTS' && <GrassrootsScreen />}
      {currentRole === 'MLA' && <MlaScreen />}
    </MobileAppShell>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainRouter />
      </AppProvider>
    </ErrorBoundary>
  );
}

