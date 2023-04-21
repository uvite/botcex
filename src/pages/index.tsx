import { WebPageJsonLd } from 'next-seo';
import React from 'react';

import { AppComponent } from '../components/app.component';
import { seoConfig } from '../seo-config';

const IndexPage = () => {
  return (
    <>
      <WebPageJsonLd
        id="https://tuleep.trade"
        description={seoConfig.description}
        lastReviewed="2023-02-28T18:45:00.000Z"
        reviewedBy={{ name: 'tuleep.trade', type: 'Organization' }}
      />
      <AppComponent />
    </>
  );
};

export default IndexPage;
