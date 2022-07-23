import { Schema, model, Document } from 'mongoose';
import User from './User';

export const DOCUMENT_NAME = 'Category';
export const COLLECTION_NAME = 'Categories';

export default interface Category extends Document {
  name?: string;
  productIds?: string[];
  numOfProducts?: Number;
  author: User;
  createdBy?: User;
  updatedBy?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    productIds:[
      {
        type: Schema.Types.String,
        required: false,
      }
    ],
    numOfProducts: {
      type: Schema.Types.String,
      required: false,
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
).index(
  { name: 'text' },
  { weights: { name: 1 }, background: false },
);

export const CategoryModel = model<Category>(DOCUMENT_NAME, schema, COLLECTION_NAME);
