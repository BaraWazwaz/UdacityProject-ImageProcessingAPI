import supertest from 'supertest';
import express from 'express';
import router from '../routes/router.js';
import sharp from 'sharp';
import fs from 'fs';

const app = express();
app.use('/', router);
const request = supertest(app);

const thumbPath = 'resources/thumb';

function clearThumbDir(): void {
    if (fs.existsSync(thumbPath)) {
        for (const file of fs.readdirSync(thumbPath)) {
            fs.rmSync(`${thumbPath}/${file}`, { force: true });
        }
    }
}

describe('GET /api/images endpoint', () => {
    beforeAll(() => clearThumbDir());
    afterAll(() => clearThumbDir());

    it('GET query filename="windowsxp.jpg"&width=100&height=100 should return a 201 status code', async () => {
        const response = await request.get(
            '/api/images?filename=windowsxp.jpg&width=100&height=100',
        );
        expect(response.status).toEqual(201);
        expect(response.type).toEqual('image/jpeg');
        const imageMetadata = await sharp(response.body).metadata();
        expect(imageMetadata.width).toEqual(100);
        expect(imageMetadata.height).toEqual(100);
    });
    it('GET query filename="windowsxp.jpg" should return a 201 status code and the original image', async () => {
        const response = await request.get(
            '/api/images?filename=windowsxp.jpg',
        );
        expect(response.status).toEqual(201);
        expect(response.type).toEqual('image/jpeg');
        const imageMetadata = await sharp(response.body).metadata();
        expect(imageMetadata.width).toEqual(1000);
        expect(imageMetadata.height).toEqual(804);
    });
    it('GET query filename="windowsxp.jpg" should return a 200 status code (caching)', async () => {
        const response = await request.get(
            '/api/images?filename=windowsxp.jpg',
        );
        expect(response.status).toEqual(200);
        expect(response.type).toEqual('image/jpeg');
        const imageMetadata = await sharp(response.body).metadata();
        expect(imageMetadata.width).toEqual(1000);
        expect(imageMetadata.height).toEqual(804);
    });
    it('GET query [empty] should return a 400 status code', async () => {
        const response = await request.get('/api/images?');
        expect(response.status).toEqual(400);
        expect(response.text).toEqual('Filename is required');
    });
    it('GET query filename="nonexistingimage.jpg" should return a 404 status code', async () => {
        const response = await request.get(
            '/api/images?filename=nonexistingimage.jpg',
        );
        expect(response.status).toEqual(404);
        expect(response.text).toEqual('Image not found');
    });
});
