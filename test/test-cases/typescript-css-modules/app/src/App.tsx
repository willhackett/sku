import React from 'react';
import lessStyles from './lessStyles.less';
import jsStyles from './jsStyles.css.js';
import tsStyles from './tsStyles.css';

enum Message {
  Hello = 'Hello World',
  Goodbye = 'Goodbye World'
}

export const messageRenderer = (): Message => {
  return Message.Hello;
};

export default () => (
  <div className={`${lessStyles.root} ${jsStyles.root} ${tsStyles.root}`}>
    <div
      className={`${lessStyles.nested} ${jsStyles.nested} ${tsStyles.nested}`}
    >
      {messageRenderer()}
    </div>
  </div>
);
