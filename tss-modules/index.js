import md5 from 'md5';
export default (styles, globalStyles = {}) => {
  const localStyles = Object.keys(styles).reduce((acc, className) => {
    const value = styles[className];
    const [mainStyles, nestedStyles] =
      value instanceof Array ? value : [value, {}];
    return Object.assign({}, acc, {
      [`.${className}`]: Object.assign({}, mainStyles, nestedStyles)
    });
  }, {});
  const allStyles = Object.assign({ ':global': globalStyles }, localStyles);
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
