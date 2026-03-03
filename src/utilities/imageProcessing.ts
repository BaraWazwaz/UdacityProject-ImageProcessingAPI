import * as filesystem from '#utilities/filesystem';
import sharp from 'sharp';
import type { Request } from 'express';

export interface ImageQuery {
    filename: string | undefined;
    width: number | undefined;
    height: number | undefined;
};

export function extractImageQueryParams(req: Request): ImageQuery {
    const filename: string | undefined = req.query.filename as string;
    const width: number | undefined = req.query.width ? correctedDimension(
        parseInt(req.query.width as string)
    ) : undefined;
    const height: number | undefined = req.query.height ? correctedDimension(
        parseInt(req.query.height as string)
    ) : undefined;
    return { filename, width, height };
}

export function correctedDimension(dimension: number | undefined): number | undefined {
    if (dimension === undefined)
        return undefined;
    if (Number.isNaN(dimension) || dimension <= 0)
        return NaN;
    return dimension;
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
    const image: sharp.Sharp = sharp(`${filesystem.INPUT_PATH}/${filename}`);
    image.resize(width, height);
    await image.toFile(
        `${filesystem.OUTPUT_PATH}/${getOutputImageFilename(filename, width, height)}`,
    );
}

export function getMetadataFromFilename(filename: string): Promise<sharp.Metadata> {
    return sharp(`${filesystem.INPUT_PATH}/${filename}`).metadata();
}

export function getMetadataFromBody(body: Buffer): Promise<sharp.Metadata> {
    return sharp(body).metadata();
}