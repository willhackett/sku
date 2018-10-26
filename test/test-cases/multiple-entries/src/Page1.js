import styles from './Page1.less';

import React from 'react';
import { hydrate } from 'react-dom';
import Welcome from './Welcome';

hydrate(
  <div className={styles.root}>
    <Welcome page="Page 1" />
  </div>,
  document.getElementById('app')
);
