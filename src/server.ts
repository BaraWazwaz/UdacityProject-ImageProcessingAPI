import express from 'express';
import router from '#routes/router';

const app: express.Application = express();
const PORT = 3000;

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
