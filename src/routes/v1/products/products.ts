import express from 'express';
import { SuccessResponse, SuccessMsgResponse, FailureMsgResponse } from '../../../core/ApiResponse';
import { ProtectedRequest } from 'app-request';
import { BadRequestError, ForbiddenError } from '../../../core/ApiError';
import ProductRepo from '../../../database/repository/ProductRepo';
import { RoleCode } from '../../../database/model/Role';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import authentication from '../../../auth/authentication';
import authorization from '../../../auth/authorization';
import role from '../../../helpers/role';
import Product from '../../../database/model/Product';
import CategoryRepo from '../../../database/repository/CategoryRepo';

const router = express.Router();

/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for writer's role
router.use('/', authentication, role(RoleCode.ADMIN), authorization);
/*-------------------------------------------------------------------------*/

const formatEndpoint = (endpoint: string) => endpoint.replace(/\s/g, '').replace(/\//g, '-');

router.post(
  '/',
  validator(schema.productCreate), 
  asyncHandler(async (req: ProtectedRequest, res) => {

    const category = await CategoryRepo.findCategoryAllDataById(req.body.category);
    if (!category)
      new FailureMsgResponse('Category is not there in record').send(res);

    const createdProduct = await ProductRepo.create({
      name: req.body.name,
      productItemsSummary: req.body.productItemsSummary,
      price: req.body.price,
      currency: req.body.currency,
      author: req.user,
      discount: req.body.discount,
      inventory: req.body.inventory,
      isVisible: req.body.isVisible,
      media: req.body.media,
      quantity: req.body.quantity,
      variants: req.body.variants,
      isManageProductItems: req.body.isManageProductItems,
      isTrackingInventory: req.body.isTrackingInventory,
      category: req.body.category,
      tags: req.body.tags,
      createdBy: req.user,
      updatedBy: req.user,
    } as Product);

    new SuccessResponse('Product created successfully', createdProduct).send(res);
  }),
);

router.put(
  '/id/:id',
  validator(schema.productId, ValidationSource.PARAM),
  validator(schema.productUpdate),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const product = await ProductRepo.findProductAllDataById(new Types.ObjectId(req.params.id));
    if (product == null) throw new BadRequestError('Product does not exists');
    if (!product.author._id.equals(req.user._id))
      throw new ForbiddenError("You don't have necessary permissions");

    product.name = req.body.name;
    product.productItemsSummary = req.body.productItemsSummary;
    product.price = req.body.price;
    product.currency = req.body.currency;
    product.discount = req.body.discount;
    product.inventory = req.body.inventory;
    product.variants = req.body.variants;
    product.media = req.body.media;
    product.quantity = req.body.quantity;
    req.body.isManageProductItems ? product.isManageProductItems = true : product.isManageProductItems = false;
    req.body.isTrackingInventory ? product.isTrackingInventory = true : product.isTrackingInventory = false;
    product.category = req.body.category;

    await ProductRepo.update(product);
    new SuccessResponse('Product updated successfully', product).send(res);
  }),
);

router.delete(
  '/id/:id',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const product = await ProductRepo.findProductAllDataById(new Types.ObjectId(req.params.id));
    if (!product) throw new BadRequestError('Product does not exists');
    if (!product.author._id.equals(req.user._id))
      throw new ForbiddenError("You don't have necessary permissions");

    await ProductRepo.deleteOne(product);
    return new SuccessMsgResponse('Product deleted successfully').send(res);
  }),
);

router.get(
  '/submitted/all',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const products = await ProductRepo.findAllSubmissionsForProducts(req.user);
    return new SuccessResponse('success',  {
      products: products,
      totalProducts: products.length,
  }).send(res);
  }),
);

router.get(
  '/id/:id',
  validator(schema.productId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const product = await ProductRepo.findProductAllDataById(new Types.ObjectId(req.params.id));
    if (!product) throw new BadRequestError('Product does not exists');
    if (!product.author._id.equals(req.user._id))
      throw new ForbiddenError("You don't have necessary permissions");
    new SuccessResponse('success', product).send(res);
  }),
);

export default router;
