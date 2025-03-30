const request = require('supertest');
const app = require('./app');

describe('Health Check Endpoint', () => {
  it('should return 200 OK with healthy status', async () => {
    const response = await request(app)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({
      status: 'healthy'
    });
  });
}); 