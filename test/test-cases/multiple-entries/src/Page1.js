import React from 'react';
import { hydrate } from 'react-dom';
import Welcome from './Welcome';

hydrate(<Welcome page="Page 1" />, document.getElementById('app'));
