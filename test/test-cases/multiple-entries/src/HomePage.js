import React from 'react';
import { hydrate } from 'react-dom';
import Home from './handlers/Home';

hydrate(<Home />, document.getElementById('app'));
