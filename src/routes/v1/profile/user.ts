import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import crypto from 'crypto';
import UserRepo from '../../../database/repository/UserRepo';
import { BadRequestError, AuthFailureError } from '../../../core/ApiError';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import _ from 'lodash';
import { Types } from 'mongoose';
import authentication from '../../../auth/authentication';
import { ProtectedRequest } from '../../../types/app-request';

const router = express.Router();

// Get Users
router.get(
  '/users/all',
  asyncHandler(async (req, res) => {
    const userList = await UserRepo.findAllUsersList();
    if (!userList) throw new BadRequestError('Users Does not exist');

    return new SuccessResponse('Users Successfully fetched',  {
      users: userList
  }).send(res);
  }),
);


//  Get Single Users
router.get(
  '/users/:id',
  validator(schema.userId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const user = await UserRepo.findProfileById(new Types.ObjectId(req.params.id));
    if (!user) throw new BadRequestError('User Does not exist');

    return new SuccessResponse('User Successfully fetched',  {
      user: user
  }).send(res);
  }),
);

// Count Users
router.get(
  '/users/get/count',
  asyncHandler(async (req, res) => {
    const userCount = await UserRepo.countUsers();
    if (!userCount) throw new BadRequestError('Users Does not exist');

    return new SuccessResponse('User count fetched successfully',  {
      totalUsers: userCount
  }).send(res);
  }),
);

// Delete User
router.delete(
  '/users/delete/:id',
  validator(schema.userId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const user = await UserRepo.findProfileById(new Types.ObjectId(req.params.id));
    if (!user) throw new BadRequestError('User Does not exist');

    await UserRepo.deleteOne(new Types.ObjectId(req.params.id), user);
    return new SuccessResponse('User Successfully Deleted', '').send(res);
  }),
);

// activate user status - status = true - api for super admin
router.put(
  '/users/activate/:id',
  validator(schema.userId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const user = await UserRepo.findProfileById(new Types.ObjectId(req.params.id));
    if (!user) throw new BadRequestError('User Does not exist');

    await UserRepo.activatUserStatus(user);
    return new SuccessResponse('User Successfully activated', {user: user}).send(res);
  }),
);

// deactivate user status - status = false  api for super admin
router.put(
  '/users/de-activate/:id',
  validator(schema.userId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const user = await UserRepo.findProfileById(new Types.ObjectId(req.params.id));
    if (!user) throw new BadRequestError('User Does not exist');

    await UserRepo.deleteOne(new Types.ObjectId(req.params.id), user);
    return new SuccessResponse('User Successfully deactivated', '').send(res);
  }),
);

/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for Access Token
router.use('/', authentication);
/*-------------------------------------------------------------------------*/

router.get(
  '/my',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');
    return new SuccessResponse('User Successfully fetched',  {
      user: user
  }).send(res);
  }),
);

router.put(
  '/',
  validator(schema.profile),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');

    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;

    await UserRepo.updateInfo(user);
    return new SuccessResponse(
      'Profile Successfully updated',{
        user: user
      }).send(res);
  }),
);

export default router;
