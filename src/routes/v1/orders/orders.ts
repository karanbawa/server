import express from 'express';
import { SuccessResponse, SuccessMsgResponse, FailureMsgResponse, BadRequestResponse } from '../../../core/ApiResponse';
import { ProtectedRequest } from 'app-request';
import { BadRequestError, ForbiddenError } from '../../../core/ApiError';
import { RoleCode } from '../../../database/model/Role';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import authentication from '../../../auth/authentication';
import authorization from '../../../auth/authorization';
import role from '../../../helpers/role';
import Order from '../../../database/model/Order';
import OrderRepo from '../../../database/repository/OrderRepo';
import Product from '../../../database/model/Product';
import OrderItem from '../../../database/model/Order-item';

const router = express.Router();

/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for writer's role
router.use('/', authentication, role(RoleCode.ADMIN), authorization);
/*-------------------------------------------------------------------------*/

// Create Order
router.post(
  '/',
  asyncHandler(async (req: ProtectedRequest, res) => {

    const orderItemsIds = Promise.all(req.body.orderItems.map( async (orderItem: { quantity: number; product: any; }) => {


      const newOrderItem = await OrderRepo.createOrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
        author: req.user,
        createdBy: req.user,
        updatedBy: req.user,
      } as OrderItem);

      // console.log('product id', newOrderItem);
      return newOrderItem.orderItem._id;
    }))

    const orderItemsIdsResolved = await orderItemsIds;

  const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem:OrderItem = await OrderRepo.findOrderItemDataById(orderItemId);
      const value = orderItem.product.price;
        const totalPrice: number = orderItem.product.price * orderItem.quantity;
      return totalPrice
  }));

  console.log('orderItemsIdsResolved ', orderItemsIdsResolved);
  console.log('totalPrices ', totalPrices);

  const totalPrice = totalPrices.reduce((a, b) => a+ b , 0 );

    let order = await OrderRepo.createOrder({
      orderItems: orderItemsIdsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrice,
      author: req.user,
      createdBy: req.user,
      updatedBy: req.user,
    } as unknown as Order);

    if (!order)
      new FailureMsgResponse('Order cannot be created').send(res);

      new SuccessResponse('Order created successfully', order).send(res);
  }),
);

// Get Orders
router.get(
  '/',
  asyncHandler(async (req: ProtectedRequest, res) => {

    const orderList = await OrderRepo.findAllSubmissionsForOrders(req.user);

    if(!orderList)
    new FailureMsgResponse('Orders does not exist').send(res);

    new SuccessResponse('Orders fetched successfully', orderList).send(res);
  }),
);

// Get Single Order
router.get(
  '/:id',
  validator(schema.orderId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {  

    const category = await OrderRepo.findOrderDataById(new Types.ObjectId(req.params.id));

    if(!category)
    new FailureMsgResponse('The category with the given ID not exists').send(res);

    new SuccessResponse('Category fetched successfully', category).send(res);
  }),
);

// Get Total Order Count
router.get(
  '/get/count',
  asyncHandler(async (req: ProtectedRequest, res) => {  

    const ordersCount = await OrderRepo.fetchOrderCount(req.user);

    if(!ordersCount)
    new FailureMsgResponse('The Orders does not exist').send(res);

    new SuccessResponse('Orders fetched successfully', ordersCount).send(res);
  }),
);

// Get Total Sales
router.get(
  '/get/totalsales',
  asyncHandler(async (req: ProtectedRequest, res) => {  

    const orderTotalSales = await OrderRepo.findOrderDataTotalSales();

    if(!orderTotalSales)
    new FailureMsgResponse('The Orders total sale record is failed to fetch').send(res);

    new SuccessResponse('Total Sales record fetched successfully', {
      totalsales: orderTotalSales.pop().totalsales
    }).send(res);
  }),
);

// Get User Order
router.get(
  '/get/usersorders/:userid',
  validator(schema.userId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {

    const orders = await OrderRepo.fetchUserOrders(new Types.ObjectId(req.params.userId));

    if(!orders)
    new FailureMsgResponse('The Orders with the given ID not exists').send(res);

    new SuccessResponse('Orders fetched successfully', orders).send(res);
  }),
);

// Update Single Order
router.put(
  '/:id',
  validator(schema.orderId,ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {

    const order = await OrderRepo.findOrderDataById(new Types.ObjectId(req.params.id));
    if (order == null) throw new BadRequestError('Order does not exists');
    if (!order.author._id.equals(req.user._id))
      throw new ForbiddenError("You don't have necessary permissions");

      order.status = req.body.status;

      const orderResult =  OrderRepo.update(order);

      if(!orderResult)
    new FailureMsgResponse('The Category cannot be updated').send(res);

    new SuccessResponse('Category updated successfully', order).send(res);
  }),
);

// Delete Single Order
router.delete(
  '/:id',
  validator(schema.orderId,ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {

      OrderRepo.delete(new Types.ObjectId(req.params.id)).then(category => {
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
