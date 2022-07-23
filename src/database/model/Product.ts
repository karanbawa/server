import { string } from '@hapi/joi';
import { Schema, model, Document } from 'mongoose';
import Category from './Category';
import User from './User';

export const DOCUMENT_NAME = 'Product';
export const COLLECTION_NAME = 'products';

export interface DiscountType {
  mode?: string,
  value?: number;
}

export interface InventoryType {
  status?: string,
  inventoryQuantity?: number;
}

export interface MediaType {
  status?: string,
  inventoryQuantity?: number;
}

export interface VariantType {
  size?: string,
  color?: string,
  quantity?: number
}

export interface MediaType {
  url?: string,
  mediaType?: string,
  width?: number,
  height?: number,
  altText?: string
}

export default interface Product extends Document {
  name: string;
  productItemsSummary?: string;
  price: number;
  currency: string;
  tags?: string[];
  author: User;
  inventory?: InventoryType;
  discount?: DiscountType;
  isVisible: boolean;
  media?: MediaType[];
  categoryIds?: Category[],
  category?: Category,
  variants?: VariantType[],
  isManageProductItems?: boolean,
  isTrackingInventory?: boolean,
  quantity?: string;
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
    productItemsSummary: {
      type: Schema.Types.String,
      required: false,
      maxlength: 500,
      trim: true,
    },
    price: {
      type: Schema.Types.Number,
      required: false,
    },
    currency: {
      type: Schema.Types.String,
      required: false,
      select: false,
    },
    discount: {
      mode: {
      type: Schema.Types.String,
      required: false,
      },
      value: {
      type: Schema.Types.Number,
      required: false,
      },
    },
    inventory: {
      status: {
      type: Schema.Types.String,
      required: false,
      },
      inventoryQuantity: {
        type: Schema.Types.Number,
        required: false
      }
    },
    tags: [
      {
        type: Schema.Types.String,
        trim: true,
        uppercase: true,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    isVisible: {
      type: Schema.Types.Boolean,
      default: true,
      select: false,
    },
    media: [{
      url: {
        type: Schema.Types.String,
        required: false,
      },
      mediaType: {
        type: Schema.Types.String,
        required: false,
      },
      width: {
        type: Schema.Types.Number,
        required: false,
      },
      height: {
        type: Schema.Types.Number,
        required: false,
      },
      altText: {
        type: Schema.Types.String,
        required: false,
      }
    }],
    categoryIds:[
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: false,
      }
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    quantity: {
      type: Schema.Types.String,
      required: false,
    },
    variants: [
      {
        size: {
          type: Schema.Types.String,
          required: false,
        },
        color: {
          type: Schema.Types.String,
          required: false,
        },
        quantity: {
          type: Schema.Types.Number,
          required: false,
        }
      }
    ],
    isManageProductItems: {
      type: Schema.Types.Boolean,
      default: false,
      required: false,
    },
    isTrackingInventory: {
      type: Schema.Types.Boolean,
      default: false,
      required: false,
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
  { name: 'text', productItemsSummary: 'text' },
  { weights: { name: 1, productItemsSummary: 3 }, background: false },
);

export const ProductModel = model<Product>(DOCUMENT_NAME, schema, COLLECTION_NAME);
