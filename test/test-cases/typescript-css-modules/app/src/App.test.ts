import lessStyles from './lessStyles.less';
import jsStyles from './jsStyles.css.js';
import tsStyles from './tsStyles.css.ts';

import { messageRenderer } from './App';

declare const SETUP_TESTS_SCRIPT_RAN: boolean;

describe('App', () => {
  test('"setupTests" script', () => {
    expect(SETUP_TESTS_SCRIPT_RAN).toEqual(true);
  });

  test('Less Styles', () => {
    expect(lessStyles.root).toEqual('lessStyles__root');
    expect(lessStyles.nested).toEqual('lessStyles__nested');
  });

  test('JS Styles', () => {
    expect(jsStyles.root).toEqual('jsStyles__root');
    expect(jsStyles.nested).toEqual('jsStyles__nested');
  });

  test('TS Styles', () => {
    expect(tsStyles.root).toMatchInlineSnapshot(`"root__959d5"`);
    expect(tsStyles.nested).toMatchInlineSnapshot(`"nested__959d5"`);
  });

  test('TS function', () => {
    expect(messageRenderer()).toBe('Hello World');
  });
});
