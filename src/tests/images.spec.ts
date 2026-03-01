import supertest from 'supertest';
import express from 'express';
import router from '../routes/router.js';

const app = express();
app.use('/', router);
const request = supertest(app);

describe('routes/api/images endpoint', () => {
    it('GET /api/images should return a 200 status code', async () => {
        const response = await request.get('/api/images');
        expect(response.status).toEqual(200);
    });
});
