import express from 'express';
import router from '#routes/router';
import cors from 'cors';
import helmet from 'helmet';

const app: express.Application = express();
const PORT = 3000;

app.use(express.json());
app.use([cors(), helmet()]);

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
