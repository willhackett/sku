import React from 'react';
import { hydrate } from 'react-dom';
import App from './App';

const render = () => hydrate(<App />, document.getElementById('app'));

export default () => {
  render();
};

if (module.hot) {
  module.hot.accept('./App.js', function() {
    render();
  });
}
