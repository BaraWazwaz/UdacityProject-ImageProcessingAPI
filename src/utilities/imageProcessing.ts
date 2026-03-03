import * as filesystem from '#utilities/filesystem';
import sharp from 'sharp';
import type { Request } from 'express';

interface ImageQuery {
    filename: string | undefined;
    width: number | undefined;
    height: number | undefined;
};

export function extractImageQueryParams(req: Request): ImageQuery {
    const filename: string | undefined = req.query.filename as string;
    const width: number | undefined = correctedDimension(
        parseInt(req.query.width as string),
    );
    const height: number | undefined = correctedDimension(
        parseInt(req.query.height as string),
    );
    return { filename, width, height };
}

export function correctedDimension(dimension: number): number | undefined {
    if (Number.isNaN(dimension) || dimension <= 0)
        return undefined;
    else
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
    const image: sharp.Sharp = sharp(`${filesystem.inputPath}/${filename}`);
    image.resize(width, height);
    await image.toFile(
        `${filesystem.outputPath}/${getOutputImageFilename(filename, width, height)}`,
    );
}