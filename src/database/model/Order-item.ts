import { Schema, model, Document } from 'mongoose';
import Product from './Product';
import User from './User';

export const DOCUMENT_NAME = 'OrderItem';
export const COLLECTION_NAME = 'orderitems';

export default interface OrderItem extends Document {
  _id?: any;
  quantity: number;
  product: Product;
  author?: User;
  createdBy?: User;
  updatedBy?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    quantity: {
      type: Schema.Types.Number,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
      index: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    createdAt: {
      type: Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Date,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

export const OrderItemModel = model<OrderItem>(DOCUMENT_NAME, schema, COLLECTION_NAME);
