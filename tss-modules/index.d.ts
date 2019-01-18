import * as CSS from 'csstype';
declare type CSSProperties = CSS.PropertiesFallback<string | number>;
interface SelectorMap {
  [selector: string]: CSSProperties;
}
declare type LocalStyles = {
  [classIdentifier: string]: CSSProperties | [CSSProperties, SelectorMap];
};
declare const _default: <Styles extends LocalStyles>(
  styles: Styles,
  globalStyles?: SelectorMap
) => { [K in keyof Styles]: string };
export default _default;
