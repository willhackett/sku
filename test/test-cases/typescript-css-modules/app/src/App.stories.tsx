import React from 'react';

// Typically would be importing from 'sku/@storybook/...'
import { text } from '../../../../../@storybook/addon-knobs';
import { storiesOf } from '../../../../../@storybook/react';

import App from './App';

storiesOf('App', module).add('Default', () => <App>{text('Text', '')}</App>);
