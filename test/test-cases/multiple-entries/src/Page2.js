import styles from './Page2.less';

import React from 'react';
import { hydrate } from 'react-dom';
import Welcome from './Welcome';

hydrate(
  <div className={styles.root}>
    <Welcome page="Page 2" />
  </div>,
  document.getElementById('app')
);
