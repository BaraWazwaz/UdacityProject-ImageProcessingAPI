import express from 'express';
import sharp from 'sharp';
import fs from 'fs';

const inputPath = 'resources/input';
const outputPath = 'resources/output';

const images: express.Router = express.Router();

function isProperImagePath(filename: string): boolean {
    const path = `${inputPath}/${filename}`;
    return fs.existsSync(path);
}

function isProperDimension(dimension: number): boolean {
    return !isNaN(dimension) && dimension > 0;
}

images.get('/', (req: express.Request, res: express.Response) => {
    const filename: string = req.query.filename as string;
    const width: number = parseInt(req.query.width as string);
    const height: number = parseInt(req.query.height as string);

    if (!filename) {
        res.status(400).send('Filename is required');
        return;
    }
    if (!isProperImagePath(filename)) {
        res.status(404).send('Image not found');
        return;
    }

    const image: sharp.Sharp = sharp(`${inputPath}/${filename}`);
    if (isProperDimension(width))
        if (isProperDimension(height))
            image.resize(width, height);
        else
            image.resize(width);
    else
        if (isProperDimension(height))
            image.resize(undefined, height);
        else
            image.resize();

    image
        .toFile(`${outputPath}/${filename}`)
        .then(() =>
            res
                .status(201)
                .sendFile(fs.realpathSync(`${outputPath}/${filename}`))
        )
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error processing image');
        });
});

export default images;
