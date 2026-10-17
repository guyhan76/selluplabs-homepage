import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.js';

for (const origin of ['http://selluplabs.com', 'https://selluplabs.com', 'http://www.selluplabs.com', 'https://selluplabs-homepage.selluplabs.workers.dev']) {
  for (const path of ['/', '/?lang=en', '/younghwa/?source=a%2Fb&next=%ED%95%9C%EA%B8%80', '/younghwa-source/younghwa-package-source-20261017.zip?download=1']) {
    test(`permanent redirect preserves path and query: ${origin}${path}`, async () => {
      const response = await worker.fetch(new Request(origin + path), {
        ASSETS: { fetch() { throw new Error('Redirect must precede asset lookup'); } },
      });
      assert.equal(response.status, 308);
      assert.equal(response.headers.get('location'), 'https://www.selluplabs.com' + path);
    });
  }
}
for (const path of ['/', '/?lang=ko', '/robots.txt', '/sitemap.xml', '/younghwa/', '/younghwa-source/', '/aiadcast-test/aiadcast-0.2.16-dev.apk']) {
  test(`canonical requests retain asset response and headers: ${path}`, async () => {
    const expected = new Response('asset bytes', {headers: {'x-robots-tag': 'noindex', 'content-disposition': 'attachment'}});
    const request = new Request('https://www.selluplabs.com' + path);
    const response = await worker.fetch(request, {ASSETS: {fetch(received) {assert.equal(received, request); return expected;}}});
    assert.equal(response, expected);
  });
}
