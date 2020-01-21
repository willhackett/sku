import React from 'react';

import jsStyles from './jsStyles.css.js';
import lessStyles from './lessStyles.less';
import logo from './logo.png';

export default () => (
  <div className={`${lessStyles.root} ${jsStyles.root}`}>
    <div className={`${lessStyles.nested} ${jsStyles.nested}`}>Hello World</div>
    <img src={logo} />
  </div>
);
