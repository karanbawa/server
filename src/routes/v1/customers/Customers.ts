import express from 'express';

import CustomerRepo from '../../../database/repository/CustomerRepo';
import asyncHandler from '../../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import { SuccessResponse, SuccessMsgResponse } from '../../../core/ApiResponse';
import { db } from '../../../config';
import Customer, { CustomerModel } from '../../../database/model/Customer';
// import authentication from '../../../auth/authentication';
// import authorization from '../../../auth/authorization';
// import role from '../../../helpers/role';
import { ProtectedRequest } from 'app-request';
import { BadRequestError } from '../../../core/ApiError';
import { Types } from 'mongoose';
import authentication from '../../../auth/authentication';
import { RoleCode } from '../../../database/model/Role';
import authorization from '../../../auth/authorization';
import role from '../../../helpers/role';

const router = express.Router();
router.use('/', authentication, role(RoleCode.ADMIN), authorization);

router.get(
  '/importcustomers',
  asyncHandler(async (req, res) => {
    const customers = await CustomerRepo.allCustomers();
    new SuccessResponse('customer created successfully', customers).send(res);
  }),
);

router.post(
  '/importcustomers',
  validator(schema.customer),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const customerData = req.body.customerInfo;
    await customerData.forEach(async (item: any, index: number) => {
      const createdCustomer = await CustomerRepo.addCustomer({
        username: item.username,
        phone: item.phone,
        email: item.email,
        address: item.address,
        rating: item.rating,
        walletBalance: item.walletBalance,
        joiningDate: item.joiningDate,
        author: req.user,
        createdBy: req.user,
        updatedBy: req.user,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Customer);
    });

    const customers = await CustomerRepo.allCustomers();
    new SuccessResponse('customer created successfully', customers).send(res);

  }),
);

router.delete(
  '/delete/:id',
  validator(schema.customerId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const customer = await CustomerRepo.findAllCustomerDataById(new Types.ObjectId(req.params.id));
    if (!customer) throw new BadRequestError('Product does not exists');
    const deletedVustomer = await CustomerRepo.deleteCustomer(new Types.ObjectId(req.params.id));
    const customers = await CustomerRepo.allCustomers();
    new SuccessResponse('customer deleted successfully', customers).send(res);
  }),
);

router.delete(
  '/deleteall',
  asyncHandler(async (req, res) => {
    const deletedcustomers = await CustomerRepo.deleteAllCustomers();
    const customers = await CustomerRepo.allCustomers();
    new SuccessResponse('customer created successfully', customers).send(res);
  }),
);

router.post(
  '/add',
  validator(schema.customerSingle),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const createdCustomer = await CustomerRepo.create({
      username: req.body.username,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      rating: req.body.rating,
      walletBalance: req.body.walletBalance,
      joiningDate: req.body.joiningDate,
      author: req.user,
      createdBy: req.user,
      updatedBy: req.user,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Customer);

    const customers = await CustomerRepo.allCustomers();
    new SuccessResponse('customer created successfully', customers).send(res);
  }),
);

router.put(
  '/update/:id',
  validator(schema.customerId, ValidationSource.PARAM),
  validator(schema.customerUpdate),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const customer = await CustomerRepo.findAllCustomerDataById(new Types.ObjectId(req.params.id));
    if (customer == null) throw new BadRequestError('Product does not exists');
    customer.username = req.body.username;
    customer.email = req.body.email;
    customer.phone = req.body.phone;
    customer.address = req.body.address;
    customer.rating = req.body.rating;
    customer.walletBalance = req.body.walletBalance;
    customer.joiningDate = req.body.joiningDate;
    const updatedCustomer = await CustomerRepo.update(customer);
    const customers = await CustomerRepo.allCustomers();

    new SuccessResponse('customer updated successfully', customers).send(res);
  }),
);


export default router;