import * as filesystem from '#utilities/filesystem';
import sharp from 'sharp';
import type { Request } from 'express';

export interface ImageQuery {
    filename: string | undefined;
    width: number | undefined;
    height: number | undefined;
}

export function extractImageQueryParams(req: Request): ImageQuery {
    const filename: string | undefined = req.query.filename as string;
    let width: number | undefined = parseInt(req.query.width as string);
    let height: number | undefined = parseInt(req.query.height as string);
    if (width <= 0 || `${width}` !== req.query.width) width = NaN;
    if (height <= 0 || `${height}` !== req.query.height) height = NaN;
    return { filename, width, height };
}

export function getOutputImageFilename(
    filename: string,
    width: number | undefined,
    height: number | undefined,
): string {
    const filenameParts = filename.split('.');
    const fileName = filenameParts[0];
    const fileExtension = filenameParts[1];
    return `${fileName}-w=${width}-h=${height}.${fileExtension}`;
}

export async function processImage(
    filename: string,
    width: number | undefined,
    height: number | undefined,
): Promise<void> {
    const image: sharp.Sharp = sharp(
        filesystem.getAbsolutePath(filename, filesystem.INPUT_PATH),
    );
    image.resize(width, height);
    const fullPath = filesystem.getAbsolutePath(
        getOutputImageFilename(filename, width, height),
        filesystem.OUTPUT_PATH,
    );
    await image.toFile(fullPath);
}

export function getMetadataFromFilename(
    filename: string,
    directory: string,
): Promise<sharp.Metadata> {
    return sharp(filesystem.getAbsolutePath(filename, directory)).metadata();
}

export function getMetadataFromBody(body: Buffer): Promise<sharp.Metadata> {
    return sharp(body).metadata();
}
