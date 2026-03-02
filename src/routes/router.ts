import express from 'express';
import images from './api/images.js';

const router: express.Router = express.Router();

router.use('/api/images', images);

router.get('/', (req: express.Request, res: express.Response) => {
    res.send('Welcome to the Image Processing API');
});

export default router;
