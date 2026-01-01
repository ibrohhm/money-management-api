require('dotenv').config();
import express, { Request, Response } from 'express';
import apiRoutes from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/healthz', (req: Request, res: Response) => {
  res.send('ok');
});

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
