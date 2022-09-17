import Joi from '@hapi/joi';

import CustomerRepo from '../../../database/repository/CustomerRepo';
import { JoiObjectId } from '../../../helpers/validator';


export default {

  customer: Joi.object().keys({
    customerInfo: Joi.array().items(
      Joi.object({
        username: Joi.string().required().min(3),
        phone: Joi.number().required(),
        email: Joi.string().required().email(),
        address: Joi.string().required(),
        rating: Joi.number().required(),
        walletBalance: Joi.string().required(),
        joiningDate: Joi.string().required(),
      }),
    ),
  }),


  customerSingle: Joi.object({
    username: Joi.string().required().min(3),
    phone: Joi.number().required(),
    email: Joi.string().required().email(),
    address: Joi.string().required(),
    rating: Joi.number().required(),
    walletBalance: Joi.string().required(),
    joiningDate: Joi.string().required(),
  }),

  customerUpdate: Joi.object({
    username: Joi.string().required().min(3),
    phone: Joi.number().required(),
    email: Joi.string().required().email(),
    address: Joi.string().required(),
    rating: Joi.number().required(),
    walletBalance: Joi.string().required(),
    joiningDate: Joi.string().required(),
  }),

  customerId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
};