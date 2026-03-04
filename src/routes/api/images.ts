import express, { type Request, type Response } from 'express';
import * as filesystem from '#utilities/filesystem';
import * as imageProcessing from '#utilities/imageProcessing';

const images: express.Router = express.Router();

// Setup and Architecture
// └─ Set up a project structure that promotes scalability
//    └─ Image processing is not done in a separate module.
//       [Fixed] moved image processing and filesystem logic to utilities directory
// Functionality
// └─ Implement comprehensive error handling for the image API
//    └─ Unable to review error messages.
//       [Fixed] added error handling for missing filename, invalid dimensions, and image processing errors
images.get('/', (req: Request, res: Response) => {
    const { filename, width, height } =
        imageProcessing.extractImageQueryParams(req);

    if (!filename) {
        res.status(400).send('Filename is required');
        return;
    }
    if (!filesystem.fileExists(filename, filesystem.INPUT_PATH)) {
        res.status(404).send('Image not found');
        return;
    }
    if (Number.isNaN(width) && Number.isNaN(height)) {
        res.status(400).send(
            'Width and height must be provided as positive numbers',
        );
        return;
    }
    if (Number.isNaN(width)) {
        res.status(400).send('Width must be provided as a positive number');
        return;
    }
    if (Number.isNaN(height)) {
        res.status(400).send('Height must be provided as a positive number');
        return;
    }

    const outputFilename: string = imageProcessing.getOutputImageFilename(
        filename,
        width,
        height,
    );

    if (filesystem.fileExists(outputFilename, filesystem.OUTPUT_PATH)) {
        res.status(200).sendFile(
            filesystem.getAbsolutePath(outputFilename, filesystem.OUTPUT_PATH),
        );
        return;
    }

    imageProcessing
        .processImage(filename, width, height)
        .then(() => {
            res.status(201).sendFile(
                filesystem.getAbsolutePath(
                    outputFilename,
                    filesystem.OUTPUT_PATH,
                ),
            );
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error processing image');
        });
});

export default images;
