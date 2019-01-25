import md5 from 'md5';
import mapValues from 'lodash/mapValues';
import { PropertiesFallback } from 'csstype';

export type CSSProperties = PropertiesFallback<string | number> & {
  select?: SelectorMap;
};

interface SelectorMap {
  [selector: string]: CSSProperties;
}

type Styles<ClassName extends string> = Record<ClassName, CSSProperties>;

const flattenSelectors = (styles: CSSProperties) => {
  const walkStyles = (currStyles: CSSProperties): object => {
    if (!currStyles.select) {
      return currStyles;
    }

    const { select = {}, ...restStyles } = currStyles;

    return { ...restStyles, ...mapValues(select, walkStyles) };
  };

  return walkStyles(styles);
};

export default <ClassName extends string>(
  styles: Styles<ClassName>,
  globalStyles: SelectorMap = {}
): Record<ClassName, string> => {
  const classNames = Object.keys(styles) as ClassName[];
  const localStyles = classNames.reduce((acc, className) => {
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
