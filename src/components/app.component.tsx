import { useSession } from 'next-auth/react';
import React from 'react';

import { useIdentifyAnalytics } from '../hooks/use-identify-analytics.hooks';
import { usePushNotifications } from '../hooks/use-push-notifications.hooks';

import { ExchangeComponent } from './exchange.component';
import { GridComponent } from './grid.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SettingsModalComponent } from './settings/settings-modal.component';
import { WithDataComponent } from './with-data.component';

export const AppComponent = () => {
  useIdentifyAnalytics();
  usePushNotifications();

  const { data: session } = useSession();

  if (session) {
    return (
      <ExchangeComponent>
        <SettingsModalComponent />
        <NavbarComponent />
        <WithDataComponent>
          {(settings) => <GridComponent layouts={settings.layouts} />}
        </WithDataComponent>
      </ExchangeComponent>
    );
  }

  return <HomeComponent />;
};
