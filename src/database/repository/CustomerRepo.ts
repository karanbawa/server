import Customer, { CustomerModel } from '../model/Customer';

import { InternalError } from '../../core/ApiError';
import { Types } from 'mongoose';
import { db } from '../../config';
import { custom } from '@hapi/joi';
// import KeystoreRepo from './KeystoreRepo';
// import Keystore from '../model/Keystore';

export default class CustomerRepo {
  // contains critical information of the user
  public static findByEmail(email: string): Promise<Customer | null> {
    return CustomerModel.findOne({ email: email }).select('+email').lean<Customer>().exec();
  }

  public static async update(customer: Customer): Promise<any> {
    customer.updatedAt = new Date();
    const updatedCustomer = await CustomerModel.updateOne(
      { _id: customer._id },
      { $set: { ...customer } },
    ).lean<Customer>().exec();
    return { customer: updatedCustomer };
  }


  public static async deleteCustomer(id: Types.ObjectId): Promise<any> {
    const delCustomer = await CustomerModel.deleteOne({ _id: id }).lean<Customer>().exec();
    return { customer: delCustomer };
  }


  public static findAllCustomerDataById(id: Types.ObjectId): Promise<Customer | null> {
    return CustomerModel.findOne({ _id: id }).lean<Customer>().exec();
  }


  public static async allCustomers(): Promise<any> {
    const allCustomersInfo = await CustomerModel.find({});
    return { customers: allCustomersInfo };
  }


  public static async addCustomer(customer: Customer): Promise<any> {
    const now = new Date();
    const newCustomer = await CustomerModel.updateOne(
      { email: customer.email },
      {
        $setOnInsert: customer,
      },
      { upsert: true },
    );

    return { customer: newCustomer };

  }

  public static async create(customer: Customer): Promise<{ customer: Customer }> {
    const now = new Date();
    const createdCustomer = await CustomerModel.create(customer);
    return { customer: createdCustomer };
  }


  public static async deleteAllCustomers(): Promise<any> {
    const allCustomersInfo = await CustomerModel.remove({});
    return { customers: allCustomersInfo }
  }
}