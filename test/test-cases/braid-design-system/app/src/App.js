import React from 'react';

import 'braid-design-system/reset';
import {
  BraidLoadableProvider,
  Text,
  Checkbox,
  Card,
  IconChevron,
  Box,
} from 'braid-design-system';
import * as style from './App.treat';

export default ({ themeName }) => {
  const [on, setOn] = React.useState(false);

  console.log('Checkbox is ', on ? 'on' : 'off');

  return (
    <BraidLoadableProvider themeName={themeName}>
      <Text>
        Hello {themeName} <IconChevron />
      </Text>
      <Card>
        <Checkbox
          checked={on}
          onChange={() => setOn((v) => !v)}
          id="id_1"
          label="This is a checkbox"
        />
      </Card>
      <Box className={style.customBox}>Custom content</Box>
    </BraidLoadableProvider>
  );
};
