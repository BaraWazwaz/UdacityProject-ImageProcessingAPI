import * as imageProcessing from '#utilities/imageProcessing';
import type { Request } from 'express';

describe('imageProcessing utility', () => {

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
});
