'use client';

import { type PropsWithChildren, useEffect } from 'react';
import {
    hapticFeedback,
    initData,
    miniApp,
    retrieveLaunchParams,
    useSignal,
} from '@telegram-apps/sdk-react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { AppRoot } from '@telegram-apps/telegram-ui';


import { ErrorBoundary } from '../components/ErrorBoundary';
import { useTelegramMock } from '../hooks/useTelegramMock';
import { useDidMount } from '../hooks/useDidMount';
import { useClientOnce } from '../hooks/useClientOnce';
import { initApp } from './init';
import { Provider } from 'react-redux';
import { store } from '../store';

function RootInner({ children }: PropsWithChildren) {

    const useTGMOCK = "true"
    // Mock Telegram environment in development mode if needed.
    if ( useTGMOCK ) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useTelegramMock();
    }

    const lp = retrieveLaunchParams();

    console.log('lp', lp)
    // const debug = isDev ;

    // Initialize the library.
    useClientOnce(() => {
        initApp();
    });

    const isDark = useSignal(miniApp.isDark);
    const initDataUser = useSignal(initData.user);

    // Set the user locale.
    useEffect(() => {
        initDataUser;
        hapticFeedback.isSupported();
    }, [initDataUser]);

    return (
        // <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
        <Provider store={store}>
            <AppRoot
                appearance={isDark ? 'dark' : 'light'}
                // platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
            >
                {children}
            </AppRoot>
            </Provider>
        // </TonConnectUIProvider>
    );
}

const FallbackComponent = () => <div>⚠️ Something went wrong. Try again.</div>;

export function Root(props: PropsWithChildren) {
  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={FallbackComponent}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : (
    <div>Loading</div>
  );
}