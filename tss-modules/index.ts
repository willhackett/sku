import md5 from 'md5';
import mapValues from 'lodash/mapValues';

import * as CSS from 'csstype';

type CSSProperties = CSS.PropertiesFallback<string | number>;
type CSSPropertiesWithSelect = CSSProperties & {
  select?: SelectorMap;
};

interface SelectorMap {
  [selector: string]: CSSPropertiesWithSelect;
}

type LocalStyles = {
  [classIdentifier: string]: CSSPropertiesWithSelect;
};

const flattenSelectors = (styles: CSSPropertiesWithSelect) => {
  const walkStyles = (currStyles: CSSPropertiesWithSelect): object => {
    if (!currStyles.select) {
      return currStyles;
    }

    const { select = {}, ...restStyles } = currStyles;

    return { ...restStyles, ...mapValues(select, walkStyles) };
  };

  return walkStyles(styles);
};

export default <Styles extends LocalStyles>(
  styles: Styles,
  globalStyles: SelectorMap = {}
): { [K in keyof Styles]: string } => {
  const localStyles = Object.keys(styles).reduce((acc, className) => {
    const accStyles = flattenSelectors(styles[className]);

    return {
      ...acc,
      [`.${className}`]: accStyles
    };
  }, {});

  const allStyles = {
    ':global': mapValues(globalStyles, flattenSelectors),
    ...localStyles
  };

  const stylesheetHash = md5(JSON.stringify(allStyles)).slice(0, 5);

  const mockCssModule = Object.assign(
    {},
    ...Object.keys(localStyles).map(className => ({
      [className]: `${className}__${stylesheetHash}`
    }))
  );

  return Object.defineProperty(mockCssModule, '__css', {
    value: allStyles,
    enumerable: false,
    writable: false
  });
};
