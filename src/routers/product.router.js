import express from 'express';
import jwt from 'jsonwebtoken';

import { prisma } from '../utils/prisma/index.js';
import { ProductsController } from '../controllers/products.controller.js';
import { ProductsService } from '../services/products.service.js';
import { ProductsRepository } from '../repositories/products.repository.js';

import { authMiddleware } from '../middlewares/auth.js';
import { newProductValidation } from '../middlewares/JoiValidation.js';

import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const router = express.Router();

const productsRepository = new ProductsRepository(prisma, jwt, SECRET_KEY);
const productsService = new ProductsService(productsRepository, jwt, SECRET_KEY);
const productsController = new ProductsController(productsService);

//상품 작성하기 기능
router.post('/', authMiddleware, newProductValidation, productsController.createProduct);

//상품 리스트 보여주기 기능
router.get('/', productsController.getProductsList);

//상품 상세 보여주기 기능
router.get('/:productId', productsController.getProductDetail);

//상품 수정하기 기능
// router.patch('/:productId', authMiddleware, newProductValidation, productsController.updateProduct);
router.patch('/:productId', newProductValidation, productsController.updateProduct);

//상품 삭제하기 기능
router.delete('/:productId', authMiddleware, productsController.deleteProduct);

export default router;
