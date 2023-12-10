import express from 'express';
import ProductsRouter from './product.router.js';
import UsersRouter from './users.router.js';

const router = express.Router();

router.use('/products/', ProductsRouter);
router.use('/auth/', UsersRouter);

export default router;
