import React from 'react';
import loadable from '@loadable/component';

import { ThemeProvider, Text } from 'braid-design-system';

const Theme = loadable.lib(({ themeName }) =>
  import(`braid-design-system/lib/themes/${themeName}`)
);

export default ({ theme }) => (
  <Theme theme={theme}>
    {({ default: theme }) => (
      <ThemeProvider theme={theme}>
        <Text>Hello World</Text>
      </ThemeProvider>
    )}
  </Theme>
);
