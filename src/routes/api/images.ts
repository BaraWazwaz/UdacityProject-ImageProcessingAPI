import express from 'express';
import sharp from 'sharp';
import fs from 'fs';

const inputPath = 'resources/full';
const outputPath = 'resources/thumb';

const images: express.Router = express.Router();

function isProperImagePath(filename: string): boolean {
    const path = `${inputPath}/${filename}`;
    return fs.existsSync(path);
}

function correctedDimension(dimension: number): number | undefined {
    if (isNaN(dimension) || dimension <= 0) return undefined;
    else return dimension;
}

function getOutputFilename(
    filename: string,
    width: number | undefined,
    height: number | undefined,
): string {
    const filenameParts = filename.split('.');
    const fileName = filenameParts[0];
    const fileExtension = filenameParts[1];
    return `${fileName}-w=${width}-h=${height}.${fileExtension}`;
}

images.get('/', async (req: express.Request, res: express.Response) => {
    const filename: string = req.query.filename as string;
    const width: number | undefined = correctedDimension(
        parseInt(req.query.width as string),
    );
    const height: number | undefined = correctedDimension(
        parseInt(req.query.height as string),
    );

    if (!filename) {
        res.status(400).send('Filename is required');
        return;
    }
    if (!isProperImagePath(filename)) {
        res.status(404).send('Image not found');
        return;
    }

    const outputFilename: string = getOutputFilename(filename, width, height);

    if (fs.existsSync(`${outputPath}/${outputFilename}`)) {
        res.status(200).sendFile(
            fs.realpathSync(`${outputPath}/${outputFilename}`),
        );
        return;
    }

    const image: sharp.Sharp = sharp(`${inputPath}/${filename}`);
    image.resize(width, height);

    image
        .toFile(`${outputPath}/${outputFilename}`)
        .then(() =>
            res
                .status(201)
                .sendFile(fs.realpathSync(`${outputPath}/${outputFilename}`)),
        )
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error processing image');
        });
});

export default images;
