const request = require('supertest');
const app = require('./server.js');

describe('POST /calculate', () => {
  test('addition: 2+2 returns 4', async () => {
    const res = await request(app)
      .post('/calculate')
      .send({ expression: '2+2' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ result: 4 });
  });

  test('subtraction: 10-3 returns 7', async () => {
    const res = await request(app)
      .post('/calculate')
      .send({ expression: '10-3' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ result: 7 });
  });

  test('multiplication: 7*8 returns 56', async () => {
    const res = await request(app)
      .post('/calculate')
      .send({ expression: '7*8' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ result: 56 });
  });

  test('division: 10/3 returns 3.333...', async () => {
    const res = await request(app)
      .post('/calculate')
      .send({ expression: '10/3' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBeCloseTo(3.3333333333333335);
  });

  test('floating point addition: 0.1+0.2', async () => {
    const res = await request(app)
      .post('/calculate')
      .send({ expression: '0.1+0.2' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBeCloseTo(0.3);
  });

  test('division by zero returns 400', async () => {
    const res = await request(app)
      .post('/calculate')
      .send({ expression: '1/0' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid expression' });
  });

  test('invalid expression: 2+*3 returns 400', async () => {
    const res = await request(app)
      .post('/calculate')
      .send({ expression: '2+*3' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid expression' });
  });

  test('empty string returns 400', async () => {
    const res = await request(app)
      .post('/calculate')
      .send({ expression: '' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid expression' });
  });

  test('missing expression field returns 400', async () => {
    const res = await request(app)
      .post('/calculate')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid expression' });
  });

  test('non-string expression returns 400', async () => {
    const res = await request(app)
      .post('/calculate')
      .send({ expression: 123 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid expression' });
  });

  test('handles whitespace in expression', async () => {
    const res = await request(app)
      .post('/calculate')
      .send({ expression: ' 2 + 2 ' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ result: 4 });
  });
});
