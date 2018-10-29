import React from 'react';
import { hydrate } from 'react-dom';
import Details from './handlers/Details';

hydrate(<Details />, document.getElementById('app'));
