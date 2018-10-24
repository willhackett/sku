const dirContentsToObject = require('../../utils/dirContentsToObject');
const runSkuScriptInDir = require('../../utils/runSkuScriptInDir');
const waitForUrls = require('../../utils/waitForUrls');
const fetch = require('node-fetch');
const skuConfig = require('./sku.config');

describe('hello-world', () => {
  // describe('start', () => {
  //   const devServerUrl = `http://localhost:${skuConfig.port}`;
  //   let server;

  //   beforeAll(async () => {
  //     server = await runSkuScriptInDir('start', __dirname);
  //     await waitForUrls(devServerUrl);
  //   });

  //   afterAll(() => {
  //     server.kill();
  //   });

  //   it('should start a development server', async () => {
  //     const response = await fetch(devServerUrl);
  //     const responseText = await response.text();
  //     expect(responseText).toMatchSnapshot();
  //   });
  // });

  describe('build', () => {
    let code;
    beforeAll(async () => {
      const code = await runSkuScriptInDir('build', __dirname);
    });

    it('should generate the expected files', async () => {
      expect(code).toBe(0);
    });
  });
});
