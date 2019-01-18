import { mapKeys, forEach } from 'lodash';
import md5 from 'md5';

import * as CSS from 'csstype';

type CSSProperties = CSS.PropertiesFallback<string | number>;

interface SelectorMap {
  [selector: string]: CSSProperties;
}

let idCount = 0;

const makeId = () => `__class_${idCount++}__`;

class ClassClass {
  styles: CSSProperties;
  nestedStyles: SelectorMap;
  id: string;

  constructor(styles: CSSProperties, nestedStyles: SelectorMap) {
    this.styles = styles;
    this.nestedStyles = nestedStyles;
    this.id = makeId();
  }

  toString() {
    return this.id;
  }
}

export const cls = (a: CSSProperties = {}, b: SelectorMap = {}) =>
  new ClassClass(a, b);

const cleanNestedStyles = (
  nestedStyles: SelectorMap,
  idToClassName: { [id: string]: string }
) =>
  mapKeys(nestedStyles, (value, key) => {
    let cleanKey = key;

    forEach(idToClassName, (className, id) => {
      cleanKey = cleanKey.replace(id, `.${className}`);
    });

    return cleanKey;
  });

type LocalStyles = {
  [classIdentifier: string]: ClassClass;
};
export const stylesheet = <Styles extends LocalStyles>(
  classClasses: Styles,
  globalStyles: SelectorMap = {}
): { [K in keyof Styles]: string } => {
  const idToClassName = Object.assign(
    {},
    ...Object.keys(classClasses).map(className => ({
      [classClasses[className].id]: className
    }))
  );

  const styles = Object.keys(classClasses).reduce(
    (acc, className) => ({
      ...acc,
      [`.${className}`]: {
        ...classClasses[className].styles,
        ...cleanNestedStyles(
          classClasses[className].nestedStyles,
          idToClassName
        )
      }
    }),
    {}
  );

  const allStyles = { ':global': globalStyles, ...styles };

  const stylesheetHash = md5(JSON.stringify(allStyles)).slice(0, 5);

  const mockCssModule = Object.assign(
    {},
    ...Object.keys(classClasses).map(className => ({
      [className]: `${className}__${stylesheetHash}`
    }))
  );

  return Object.defineProperty(mockCssModule, '__css', {
    value: allStyles,
    enumerable: false,
    writable: false
  });
};
