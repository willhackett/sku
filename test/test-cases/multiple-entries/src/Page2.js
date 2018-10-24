import React from 'react';
import { hydrate } from 'react-dom';
import Welcome from './Welcome';

hydrate(<Welcome page="Page 2" />, document.getElementById('app'));
