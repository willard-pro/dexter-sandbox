const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');

const app = require('./server');

let server;
let baseUrl;

before(() => {
  return new Promise((resolve) => {
    server = app.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

after(() => {
  return new Promise((resolve) => {
    server.close(resolve);
  });
});

function postCalculate(body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      `${baseUrl}/calculate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => (responseBody += chunk));
        res.on('end', () => {
          resolve({ status: res.statusCode, body: JSON.parse(responseBody) });
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

describe('POST /calculate', () => {
  it('should add two numbers', async () => {
    const { status, body } = await postCalculate({ expression: '2+2' });
    assert.strictEqual(status, 200);
    assert.strictEqual(body.result, 4);
  });

  it('should subtract two numbers', async () => {
    const { status, body } = await postCalculate({ expression: '10-3' });
    assert.strictEqual(status, 200);
    assert.strictEqual(body.result, 7);
  });

  it('should multiply two numbers', async () => {
    const { status, body } = await postCalculate({ expression: '4*5' });
    assert.strictEqual(status, 200);
    assert.strictEqual(body.result, 20);
  });

  it('should divide two numbers', async () => {
    const { status, body } = await postCalculate({ expression: '8/2' });
    assert.strictEqual(status, 200);
    assert.strictEqual(body.result, 4);
  });

  it('should respect operator precedence', async () => {
    const { status, body } = await postCalculate({ expression: '2+3*4' });
    assert.strictEqual(status, 200);
    assert.strictEqual(body.result, 14);
  });

  it('should return 400 for division by zero', async () => {
    const { status, body } = await postCalculate({ expression: '1/0' });
    assert.strictEqual(status, 400);
    assert.ok(body.error);
  });

  it('should return 400 for invalid syntax', async () => {
    const { status, body } = await postCalculate({ expression: '2++2' });
    assert.strictEqual(status, 400);
    assert.ok(body.error);
  });

  it('should return 400 for missing expression', async () => {
    const { status, body } = await postCalculate({});
    assert.strictEqual(status, 400);
    assert.ok(body.error);
  });

  it('should return 400 for non-string expression', async () => {
    const { status, body } = await postCalculate({ expression: 123 });
    assert.strictEqual(status, 400);
    assert.ok(body.error);
  });

  it('should handle negative numbers', async () => {
    const { status, body } = await postCalculate({ expression: '-5+10' });
    assert.strictEqual(status, 200);
    assert.strictEqual(body.result, 5);
  });

  it('should handle decimal results', async () => {
    const { status, body } = await postCalculate({ expression: '10/3' });
    assert.strictEqual(status, 200);
    assert.ok(Math.abs(body.result - 3.3333333333333335) < 0.0001);
  });
});
