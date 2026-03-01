import express from 'express';

const images: express.Router = express.Router();

images.get('/', (req: express.Request, res: express.Response) => {
    res.send('Images API');
});

export default images;
