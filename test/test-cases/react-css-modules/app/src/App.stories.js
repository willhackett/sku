import React from 'react';

import { text } from '../../../../../@storybook/addon-knobs';
import { storiesOf } from '../../../../../@storybook/react';

import App from './App';

// Typically would be importing from 'sku/@storybook/...'

storiesOf('App', module).add('Default', () => (
  <App>{text('Text', 'Storybook render')}</App>
));
