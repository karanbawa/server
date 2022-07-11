import Joi from '@hapi/joi';
import { JoiObjectId, JoiUrlEndpoint } from '../../../helpers/validator';

export default {
  blogUrl: Joi.object().keys({
    endpoint: JoiUrlEndpoint().required().max(200),
  }),
  productId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  blogTag: Joi.object().keys({
    tag: Joi.string().required(),
  }),
  pagination: Joi.object().keys({
    pageNumber: Joi.number().required().integer().min(1),
    pageItemCount: Joi.number().required().integer().min(1),
  }),
  authorId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  productCreate: Joi.object().keys({
    name: Joi.string().required().min(3).max(500),
    productItemsSummary: Joi.string().optional().min(1).max(500),
    price: Joi.string().required().min(0).max(50000),
    currency: Joi.string().optional().min(0).max(50000),
    discount: Joi.object().optional(),
    inventory: Joi.object().optional(),
    isVisible: Joi.bool().optional(),
    variants: Joi.array().optional().min(0).items(Joi.object()),
    media: Joi.array().optional().min(0).items(Joi.object()),
    quantity: Joi.string().optional().min(0).max(500),
    tags: Joi.array().optional().min(0).items(Joi.string().uppercase()),
    isManageProductItems: Joi.boolean().optional(),
    isTrackingInventory: Joi.boolean().optional(),
    categoryIds: Joi.array().optional().min(1).items(Joi.number())
  }),
  productUpdate: Joi.object().keys({
    name: Joi.string().required().min(3).max(500),
    productItemsSummary: Joi.string().optional().min(1).max(500),
    price: Joi.string().required().min(0).max(50000),
    currency: Joi.string().optional().min(0).max(50000),
    discount: Joi.object().optional(),
    inventory: Joi.object().optional(),
    isVisible: Joi.bool().optional(),
    variants: Joi.array().optional().min(0).items(Joi.object()),
    media: Joi.array().optional().min(0).items(Joi.object()),
    quantity: Joi.string().optional().min(0).max(500),
    tags: Joi.array().optional().min(0).items(Joi.string().uppercase()),
    isManageProductItems: Joi.boolean().optional(),
    isTrackingInventory: Joi.boolean().optional(),
    categoryIds: Joi.array().optional().min(1).items(Joi.number())
  }),
};
