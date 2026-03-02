import supertest from 'supertest';
import express from 'express';
import router from '../routes/router.js';

const app = express();
app.use('/', router);
const request = supertest(app);

describe('GET / endpoint', () => {
    it('GET / should return a 200 status code', async () => {
        const response = await request.get('/');
        expect(response.status).toEqual(200);
        expect(response.text).toEqual('Welcome to the Image Processing API');
    });
});
