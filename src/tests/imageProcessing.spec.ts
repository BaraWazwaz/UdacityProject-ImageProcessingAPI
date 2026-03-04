import * as imageProcessing from '#utilities/imageProcessing';
import * as filesystem from '#utilities/filesystem';
import type { Request } from 'express';

const REAL_IMAGE = 'windowsxp.jpg';

describe('imageProcessing utility', () => {

    describe('Environment Setup', () => {
        it('should have the test image windowsxp.jpg in the input directory', () => {
            expect(filesystem.fileExists(REAL_IMAGE, filesystem.INPUT_PATH)).toBeTrue();
        });
    });

    describe('extractImageQueryParams', () => {
        it('All parameters provided', () => {
            const req = { query: { filename: 'cat.jpg', width: '200', height: '150' } } as unknown as Request;
            const result = imageProcessing.extractImageQueryParams(req);
            expect(result.filename).toEqual('cat.jpg');
            expect(result.width).toEqual(200);
            expect(result.height).toEqual(150);
        });
        it('No parameters provided', () => {
            const req = { query: {} } as unknown as Request;
            const result = imageProcessing.extractImageQueryParams(req);
            expect(result.filename).toBeUndefined();
            expect(result.width).toBeNaN();
            expect(result.height).toBeNaN();
        });
        it('Only filename provided', () => {
            const req = { query: { filename: 'cat.jpg' } } as unknown as Request;
            const result = imageProcessing.extractImageQueryParams(req);
            expect(result.filename).toEqual('cat.jpg');
            expect(result.width).toBeNaN();
            expect(result.height).toBeNaN();
        });
        it('Zero width', () => {
            const req = { query: { filename: 'cat.jpg', width: '0' } } as unknown as Request;
            const result = imageProcessing.extractImageQueryParams(req);
            expect(result.width).toBeNaN();
        });
        it('Negative width', () => {
            const req = { query: { filename: 'cat.jpg', width: '-5' } } as unknown as Request;
            const result = imageProcessing.extractImageQueryParams(req);
            expect(result.width).toBeNaN();
        });
        it('Non-numeric width', () => {
            const req = { query: { filename: 'cat.jpg', width: 'abc' } } as unknown as Request;
            const result = imageProcessing.extractImageQueryParams(req);
            expect(result.width).toBeNaN();
        });
        it('Zero height', () => {
            const req = { query: { filename: 'cat.jpg', height: '0' } } as unknown as Request;
            const result = imageProcessing.extractImageQueryParams(req);
            expect(result.height).toBeNaN();
        });
        it('Negative height', () => {
            const req = { query: { filename: 'cat.jpg', height: '-10' } } as unknown as Request;
            const result = imageProcessing.extractImageQueryParams(req);
            expect(result.height).toBeNaN();
        });
        it('Non-numeric height', () => {
            const req = { query: { filename: 'cat.jpg', height: 'xyz' } } as unknown as Request;
            const result = imageProcessing.extractImageQueryParams(req);
            expect(result.height).toBeNaN();
        });
    });

    describe('getOutputImageFilename', () => {
        it('No dimensions provided', () => {
            expect(imageProcessing.getOutputImageFilename('cat.jpg', undefined, undefined))
                .toEqual('cat-w=undefined-h=undefined.jpg');
        });
        it('Both dimensions provided', () => {
            expect(imageProcessing.getOutputImageFilename('cat.jpg', 200, 150))
                .toEqual('cat-w=200-h=150.jpg');
        });
        it('Only height provided', () => {
            expect(imageProcessing.getOutputImageFilename('cat.jpg', undefined, 150))
                .toEqual('cat-w=undefined-h=150.jpg');
        });
        it('Only width provided', () => {
            expect(imageProcessing.getOutputImageFilename('cat.jpg', 200, undefined))
                .toEqual('cat-w=200-h=undefined.jpg');
        });
        it('PNG extension', () => {
            expect(imageProcessing.getOutputImageFilename('photo.png', 100, 100).endsWith('.png'))
                .toBeTrue();
        });
        it('GIF extension', () => {
            expect(imageProcessing.getOutputImageFilename('photo.gif', 100, 100).endsWith('.gif'))
                .toBeTrue();
        });
        it('JPEG extension', () => {
            expect(imageProcessing.getOutputImageFilename('photo.jpeg', 100, 100).endsWith('.jpeg'))
                .toBeTrue();
        });
    });

    describe('Image Processing Functions', () => {
        const TEST_WIDTH = 100;
        const TEST_HEIGHT = 100;
        const OUTPUT_FILE = 'windowsxp-w=100-h=100.jpg';

        afterEach(() => {
            if (filesystem.fileExists(OUTPUT_FILE, filesystem.OUTPUT_PATH)) {
                filesystem.deleteFile(OUTPUT_FILE, filesystem.OUTPUT_PATH);
            }
        });

        it('processImage should create a resized image', async () => {
            await imageProcessing.processImage(REAL_IMAGE, TEST_WIDTH, TEST_HEIGHT);
            expect(filesystem.fileExists(OUTPUT_FILE, filesystem.OUTPUT_PATH)).toBeTrue();
        });

        it('getMetadataFromFilename should return image metadata', async () => {
            const metadata = await imageProcessing.getMetadataFromFilename(REAL_IMAGE, filesystem.INPUT_PATH);
            expect(metadata.width).toEqual(1000);
            expect(metadata.height).toEqual(804);
        });

        it('getMetadataFromBody should return image metadata from body', async () => {
            const buffer: Buffer = filesystem.readFile(REAL_IMAGE, filesystem.INPUT_PATH);
            const metadata = await imageProcessing.getMetadataFromBody(buffer);
            expect(metadata.width).toEqual(1000);
            expect(metadata.height).toEqual(804);
        });
    });
});
