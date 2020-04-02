const { promisify } = require('util');
const { relative } = require('path');
const readFilesAsync = promisify(require('node-dir').readFiles);
const gzipSize = require('gzip-size');

const directory = process.argv[2];

function toKB(size) {
  const kbSize = (size / 1024).toFixed(2);

  return `${kbSize}KB`;
}

(async () => {
  const data = [];

  const handleFile = (err, content, filePath, next) => {
    if (err) {
      throw err;
    }

    const relativeFilePath = relative(directory, filePath);

    gzipSize(content).then((zipped) => {
      data.push([relativeFilePath, content.length, zipped]);

      next();
    });
  };

  await readFilesAsync(directory, handleFile);

  data.sort((a, b) => b[1] - a[1]);

  console.table(
    data.map(([fileName, raw, gzip]) => [fileName, toKB(raw), toKB(gzip)]),
  );
})();
