import { model, Schema, Document } from 'mongoose';
import User from './User';
export const DOCUMENT_NAME = 'Customer';
export const COLLECTION_NAME = 'customers';

export default interface Customer extends Document {
  username: string;
  email: string;
  phone: number;
  address: string;
  rating: string;
  walletBalance: string;
  joiningDate: string;
  author: User;
  createdBy?: User;
  updatedBy?: User;
  createdAt?: Date;
  updatedAt?: Date;
}


const schema = new Schema({
  username: {
    type: Schema.Types.String,
    required: true,
    trim: true,
    maxlength: 100,
  },

  email: {
    type: Schema.Types.String,
    required: true,
    unique: true,
    trim: true,
    sparse: true,
  },

  phone: {
    type: Schema.Types.Number,
    required: true,
    trim: true,
    maxlength: 10,
    minlength: 10,
  },

  address: {
    type: Schema.Types.String,
    required: true,
  },

  rating: {
    type: Schema.Types.Number,
    required: true,
  },

  walletBalance: {
    type: Schema.Types.String,
    required: true,
  },

  joiningDate: {
    type: Schema.Types.String,
    required: true,
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
});


export const CustomerModel = model<Customer>(DOCUMENT_NAME, schema, COLLECTION_NAME);