module.exports = (src, { isModule }) => {
  const attributes = [];

  if (isModule) {
    attributes.push('type="module"');
  } else {
    attributes.push('nomodule');
  }

  attributes.push(`src="${src}"`);

  if (/^(https?:)?\/\//.test(src)) {
    attributes.push('crossorigin="anonymous"');
  }

  return `<script ${attributes.join(' ')}></script>`;
};
