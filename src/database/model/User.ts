import { model, Schema, Document } from 'mongoose';
import Role from './Role';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export default interface User extends Document { 
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  password: string;
  roles: Role[];
  verified?: boolean;
  status?: boolean;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    firstName: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    lastName: {
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
      select: false,
    },
    phoneNumber: {
      type: Schema.Types.Number,
      required: true,
      trim: true,
      maxlength: 10,
      minlength: 10
    },
    password: {
      type: Schema.Types.String,
      select: false,
      required: true,
      maxlength: 100
    },
    roles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Role',
        },
      ],
      required: false,
      select: false,
    },
    verified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    status: {
      type: Schema.Types.Boolean,
      default: false,
    },
    deleted: {
      type: Schema.Types.Boolean,
      default: false,
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

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
