import supertest from 'supertest';
import express from 'express';
import * as filesystem from '#utilities/filesystem';
import * as imageProcessing from '#utilities/imageProcessing';
import router from '#routes/router';

const app = express();
app.use('/', router);
const request = supertest(app);

function clearThumbDir(): void {
    filesystem
        .getFiles(filesystem.OUTPUT_PATH)
        .forEach(file => filesystem.deleteFile(file));
}

describe('GET /api/images endpoint', () => {
    beforeAll(() => clearThumbDir());
    afterAll(() => clearThumbDir());

    describe('Valid queries', () => {
        it('Valid filename and valid dimensions should return a 201 status code', async () => {
            const response = await request.get('/api/images?filename=windowsxp.jpg&width=100&height=100');
            expect(response.status).toEqual(201);
            expect(response.type).toEqual('image/jpeg');
            const imageMetadata = await imageProcessing.getMetadataFromBody(response.body);
            expect(imageMetadata.width).toEqual(100);
            expect(imageMetadata.height).toEqual(100);
            expect(filesystem.fileExistsInOutput('windowsxp-w=100-h=100.jpg')).toBeTruthy();
        });
        it('Valid filename and no dimensions should return a 201 status code and the original image', async () => {
            const response = await request.get('/api/images?filename=windowsxp.jpg');
            expect(response.status).toEqual(201);
            expect(response.type).toEqual('image/jpeg');
            const imageMetadata = await imageProcessing.getMetadataFromBody(response.body);
            expect(imageMetadata.width).toEqual(1000);
            expect(imageMetadata.height).toEqual(804);
            expect(filesystem.fileExistsInOutput('windowsxp-w=undefined-h=undefined.jpg')).toBeTruthy();
        });
        it('Repeated request should return a 200 status code (caching)', async () => {
            const response = await request.get('/api/images?filename=windowsxp.jpg');
            expect(response.status).toEqual(200);
            expect(response.type).toEqual('image/jpeg');
            const imageMetadata = await imageProcessing.getMetadataFromBody(response.body);
            expect(imageMetadata.width).toEqual(1000);
            expect(imageMetadata.height).toEqual(804);
            expect(filesystem.fileExistsInOutput('windowsxp-w=undefined-h=undefined.jpg')).toBeTruthy();
        });
    });
    describe('Invalid queries', () => {
        it('Filename missing extension should return a 404 status code', async () => {
            const response = await request.get('/api/images?filename=windowsxp');
            expect(response.status).toEqual(404);
            expect(response.text).toEqual('Image not found');
        });
        it('Empty query should return a 400 status code', async () => {
            const response = await request.get('/api/images?');
            expect(response.status).toEqual(400);
            expect(response.text).toEqual('Filename is required');
        });
        it('Non existing filename should return a 404 status code', async () => {
            const response = await request.get('/api/images?filename=nonexistingimage.jpg');
            expect(response.status).toEqual(404);
            expect(response.text).toEqual('Image not found');
        });
        it('Zero width should return a 400 status code', async () => {
            const response = await request.get('/api/images?filename=windowsxp.jpg&width=0');
            expect(response.status).toEqual(400);
            expect(response.text).toEqual('Width must be a positive number');
        });
        it('Zero height should return a 400 status code', async () => {
            const response = await request.get('/api/images?filename=windowsxp.jpg&height=0');
            expect(response.status).toEqual(400);
            expect(response.text).toEqual('Height must be a positive number');
        });
        it('Non number width should return a 400 status code', async () => {
            const response = await request.get('/api/images?filename=windowsxp.jpg&width=nonnumber');
            expect(response.status).toEqual(400);
            expect(response.text).toEqual('Width must be a positive number');
        });
        it('Non number height should return a 400 status code', async () => {
            const response = await request.get('/api/images?filename=windowsxp.jpg&height=nonnumber');
            expect(response.status).toEqual(400);
            expect(response.text).toEqual('Height must be a positive number');
        });
        it('Negative width should return a 400 status code', async () => {
            const response = await request.get('/api/images?filename=windowsxp.jpg&width=-1');
            expect(response.status).toEqual(400);
            expect(response.text).toEqual('Width must be a positive number');
        });
        it('Negative height should return a 400 status code', async () => {
            const response = await request.get('/api/images?filename=windowsxp.jpg&height=-1');
            expect(response.status).toEqual(400);
            expect(response.text).toEqual('Height must be a positive number');
        });
    });
});
