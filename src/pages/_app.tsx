import { JitsuProvider, createClient, usePageView } from '@jitsu/nextjs';
import { Provider as JotaiProvider } from 'jotai';
import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import React from 'react';
import Modal from 'react-modal';
import { Flip, ToastContainer } from 'react-toastify';

import { seoConfig } from '../seo-config';
import { startBugSnag } from '../utils/bugsnag';

import '../styles/globals.scss';
import 'react-grid-layout/css/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import 'react-toggle/style.css';
import 'react-tooltip/dist/react-tooltip.css';
import 'react-tagsinput/react-tagsinput.css';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-resizable/css/styles.css';

if (process.env.STAGE !== 'dev') {
  startBugSnag();
}

//Modal.setAppElement('#modal');

type AppPropsWithSession = AppProps & {
  pageProps: AppProps['pageProps'] & {
    session?: Session | null;
  };
};

const jitsuClient = createClient({
  key: 'js.uoxwyzspo4f1r827idozyp.299hanzasr2w68zrp29tgt',
  tracking_host: 'https://e.tuleep.trade',
});

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithSession) => {
  usePageView(jitsuClient);

  return (
    <JitsuProvider client={jitsuClient}>
      <SessionProvider session={session}>
        <JotaiProvider>
          <DefaultSeo
            title="super trading terminal"
            titleTemplate="tuleep.trade | %s"
            description={seoConfig.description}
            additionalMetaTags={[{ property: 'image', content: '' }]}
            twitter={{ site: '@tuleep', handle: '@tuleep' }}
            openGraph={{
              type: 'website',
              url: 'https://tuleep.trade',
              title: seoConfig.title,
              description: seoConfig.description,
              site_name: 'tuleep.trade',
              locale: 'en_US',
              images: [
                {
                  url: seoConfig.image,
                  alt: seoConfig.title,
                  height: 630,
                  width: 1200,
                },
              ],
            }}
          />
          <Component {...pageProps} />
          <ToastContainer
            theme="dark"
            position="bottom-right"
            newestOnTop={true}
            autoClose={1000}
            transition={Flip}
          />
        </JotaiProvider>
      </SessionProvider>
    </JitsuProvider>
  );
};

export default MyApp;
