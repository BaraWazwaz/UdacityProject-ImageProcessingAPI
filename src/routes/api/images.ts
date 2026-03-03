import express, { type Request, type Response } from 'express';
import * as filesystem from '#utilities/filesystem';
import * as imageProcessing from '#utilities/imageProcessing';

const images: express.Router = express.Router();

// Setup and Architecture
// └─ Set up a project structure that promotes scalability
//    └─ Image processing is not done in a separate module.
//       [Fixed] moved image processing and filesystem logic to utilities directory
images.get('/', async (req: Request, res: Response) => {
    const { filename, width, height } = imageProcessing.extractImageQueryParams(req);

    if (filename === undefined) {
        res
            .status(400)
            .send('Filename is required');
        return;
    }
    if (!filesystem.fileExistsInInput(filename)) {
        res
            .status(404)
            .send('Image not found');
        return;
    }

    const outputFilename: string = imageProcessing.getOutputImageFilename(filename, width, height);

    if (filesystem.fileExistsInOutput(outputFilename)) {
        res
            .status(200)
            .sendFile(filesystem.getAbsolutePath(outputFilename));
        return;
    }

    imageProcessing.processImage(filename, width, height)
        .then(() => {
            res
                .status(201)
                .sendFile(filesystem.getAbsolutePath(outputFilename));
        })
        .catch((err) => {
            console.error(err);
            res
                .status(500)
                .send('Error processing image');
        });
});

export default images;