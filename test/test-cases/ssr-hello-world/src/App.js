import React from 'react';
import lessStyles from './lessStyles.less';
import jsStyles from './jsStyles.css.js';
import { hot } from '../../../../react-hot-loader/root';

export default hot(() => (
  <div className={`${lessStyles.root} ${jsStyles.root}`}>
    <div className={`${lessStyles.nested} ${jsStyles.nested}`}>Hello World</div>
  </div>
));
