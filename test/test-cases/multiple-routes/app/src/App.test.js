import { render } from '@testing-library/react';
import React from 'react';
import { StaticRouter } from 'react-router-dom';

import App from './App';

describe('multiple-routes', () => {
  it('should support loadable components', () => {
    const { container } = render(
      <StaticRouter location="/" context={{}}>
        <App site="AU" />
      </StaticRouter>,
    );

    expect(container.innerHTML).toMatchInlineSnapshot(`"Loading Home..."`);
  });
});
