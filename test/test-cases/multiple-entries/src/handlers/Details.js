/* eslint react/no-did-mount-set-state: off */
import styles from './Details.less';

import loadable from '@loadable/component';
import React from 'react';

const AsyncComponent = loadable(() => import('./AsyncComponent'));

export default class Details extends React.Component {
  constructor() {
    super();
    this.state = {
      id: null
    };
  }

  render() {
    const { id } = this.state;

    return (
      <h1 className={styles.root}>
        Welcome to the Details page - {this.props.site}
        {id && `ID: ${id}`}
        <AsyncComponent />
      </h1>
    );
  }
}
