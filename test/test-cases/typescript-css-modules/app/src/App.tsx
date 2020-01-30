import React, { ReactNode } from 'react';

import jsStyles from './jsStyles.css.js';
import lessStyles from './lessStyles.less';
import './globalTypes.d';

enum Message {
  Hello = 'Hello World',
  Goodbye = 'Goodbye World',
}

export const messageRenderer = (): Message => Message.Hello;

interface Props {
  children?: ReactNode;
}

export default ({ children }: Props) => (
  <div className={`${lessStyles.root} ${jsStyles.root}`}>
    <div
      className={`${lessStyles.nested} ${jsStyles.nested}`}
      data-automation-text
    >
      {children || messageRenderer()}
    </div>
  </div>
);
