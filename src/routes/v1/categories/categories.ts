import express from 'express';
import { SuccessResponse, SuccessMsgResponse, FailureMsgResponse, BadRequestResponse } from '../../../core/ApiResponse';
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
import Category from '../../../database/model/Category';
import CategoryRepo from '../../../database/repository/CategoryRepo';

const router = express.Router();

/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for writer's role
router.use('/', authentication, role(RoleCode.ADMIN), authorization);
/*-------------------------------------------------------------------------*/

router.post( 
  '/',
  asyncHandler(async (req: ProtectedRequest, res) => {

    const createdCategory = await CategoryRepo.create({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
      author: req.user,
      createdBy: req.user,
      updatedBy: req.user,
    } as Category);

    if(!createdCategory)
    new FailureMsgResponse('Category failed to create').send(res);

    new SuccessResponse('Category created successfully', createdCategory).send(res);
  }),
);

router.get(
  '/',
  asyncHandler(async (req: ProtectedRequest, res) => {

    const categoryList = await CategoryRepo.findAllSubmissionsForCategories(req.user);

    if(!categoryList)
    new FailureMsgResponse('Categories does not exist').send(res);

    new SuccessResponse('Category created successfully', categoryList).send(res);
  }),
);

router.get(
  '/:id',
  validator(schema.categoryId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {  

    const category = await CategoryRepo.findCategoryAllDataById(new Types.ObjectId(req.params.id));

    if(!category)
    new FailureMsgResponse('The category with the given ID not exists').send(res);

    new SuccessResponse('Category fetched successfully', category).send(res);
  }),
);

router.put(
  '/:id',
  validator(schema.categoryId,ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {

    const category = await CategoryRepo.findCategoryAllDataById(new Types.ObjectId(req.params.id));
    if (category == null) throw new BadRequestError('Category does not exists');
    if (!category.author._id.equals(req.user._id))
      throw new ForbiddenError("You don't have necessary permissions");

      category.name = req.body.name;
      category.icon = req.body.icon;
      category.color = req.body.color;

      const categoryResult =  CategoryRepo.update(category);

      if(!categoryResult)
    new FailureMsgResponse('The Category cannot be updated').send(res);

    new SuccessResponse('Category updated successfully', category).send(res);
  }),
);

router.delete(
  '/:id',
  validator(schema.categoryId,ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {

      CategoryRepo.delete(new Types.ObjectId(req.params.id)).then(category => {
        if(category){
            new SuccessResponse('Category deleted successfully', category).send(res);
        } else {
          new FailureMsgResponse('Category cannot find').send(res);
        }
    }).catch (err=>{
         new BadRequestResponse('Category failed to delete').send(res);
    });
  }),
);



export default router;
