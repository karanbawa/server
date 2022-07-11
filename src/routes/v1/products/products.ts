import express from 'express';
import { SuccessResponse, SuccessMsgResponse } from '../../../core/ApiResponse';
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
      categoryIds: req.body.isTrackingInventory,
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
    const product = await ProductRepo.findBlogAllDataById(new Types.ObjectId(req.params.id));
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
    product.categoryIds = req.body.categoryIds;

    await ProductRepo.update(product);
    new SuccessResponse('Product updated successfully', product).send(res);
  }),
);

// router.put(
//   '/submit/:id',
//   validator(schema.blogId, ValidationSource.PARAM),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const blog = await BlogRepo.findBlogAllDataById(new Types.ObjectId(req.params.id));
//     if (!blog) throw new BadRequestError('Blog does not exists');
//     if (!blog.author._id.equals(req.user._id))
//       throw new ForbiddenError("You don't have necessary permissions");

//     blog.isSubmitted = true;
//     blog.isDraft = false;

//     await BlogRepo.update(blog);
//     return new SuccessMsgResponse('Blog submitted successfully').send(res);
//   }),
// );

// router.put(
//   '/withdraw/:id',
//   validator(schema.blogId, ValidationSource.PARAM),
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const blog = await BlogRepo.findBlogAllDataById(new Types.ObjectId(req.params.id));
//     if (!blog) throw new BadRequestError('Blog does not exists');
//     if (!blog.author._id.equals(req.user._id))
//       throw new ForbiddenError("You don't have necessary permissions");

//     blog.isSubmitted = false;
//     blog.isDraft = true;

//     await BlogRepo.update(blog);
//     return new SuccessMsgResponse('Blog withdrawn successfully').send(res);
//   }),
// );

router.delete(
  '/id/:id',
  validator(schema.productId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const product = await ProductRepo.findBlogAllDataById(new Types.ObjectId(req.params.id));
    if (!product) throw new BadRequestError('Product does not exists');
    if (!product.author._id.equals(req.user._id))
      throw new ForbiddenError("You don't have necessary permissions");

    await ProductRepo.update(product);
    return new SuccessMsgResponse('Product deleted successfully').send(res);
  }),
);

router.get(
  '/submitted/all',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const blogs = await ProductRepo.findAllSubmissionsForProducts(req.user);
    return new SuccessResponse('success', blogs).send(res);
  }),
);

// router.get(
//   '/published/all',
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const blogs = await BlogRepo.findAllPublishedForWriter(req.user);
//     return new SuccessResponse('success', blogs).send(res);
//   }),
// );

// router.get(
//   '/drafts/all',
//   asyncHandler(async (req: ProtectedRequest, res) => {
//     const blogs = await BlogRepo.findAllDraftsForWriter(req.user);
//     return new SuccessResponse('success', blogs).send(res);
//   }),
// );

router.get(
  '/id/:id',
  validator(schema.productId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const product = await ProductRepo.findBlogAllDataById(new Types.ObjectId(req.params.id));
    if (!product) throw new BadRequestError('Blog does not exists');
    if (!product.author._id.equals(req.user._id))
      throw new ForbiddenError("You don't have necessary permissions");
    new SuccessResponse('success', product).send(res);
  }),
);

export default router;
