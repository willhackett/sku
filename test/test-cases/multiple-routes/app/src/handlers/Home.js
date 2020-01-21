import React from 'react';

import styles from './Home.less';

export default props => (
  <h1 className={styles.root}>Welcome to the Home page - {props.site}</h1>
);
