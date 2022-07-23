import { Schema, model, Document } from 'mongoose';
import OrderItem from './Order-item';
import User from './User';

export const DOCUMENT_NAME = 'Order';
export const COLLECTION_NAME = 'orders';

export default interface Order extends Document {
  orderItems: OrderItem[];
  shippingAddress1?: string;
  shippingAddress2?: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  status: string;
  totalPrice: Number;
  dateOrdered?: Date;
  author: User;
  createdBy?: User;
  updatedBy?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    orderItems: [{
      type: Schema.Types.ObjectId,
      ref: 'OrderItem',
      required: true,
    }],
    shippingAddress1: {
      type: Schema.Types.String,
      required: true,
    },
    shippingAddress2: {
      type: Schema.Types.String,
      required: false,
    },
    city: {
      type: Schema.Types.String,
      required: true,
    },
    zip: {
      type: Schema.Types.String,
      required: true,
    },
    country: {
      type: Schema.Types.String,
      required: true,
    },
    phone: {
      type: Schema.Types.String,
      required: true,
    },
    status: {
      type: Schema.Types.String,
      required: true,
      default: 'Pending'
    },
    totalPrice: {
      type: Schema.Types.Number,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    dateOrdered: {
      type: Date,
      dafault: Date.now()
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

export const OrderModel = model<Order>(DOCUMENT_NAME, schema, COLLECTION_NAME);
