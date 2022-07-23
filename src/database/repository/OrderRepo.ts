import Order, { OrderModel } from '../model/Order';
import OrderItem, { OrderItemModel } from '../model/Order-item';
import { Types } from 'mongoose';
import User from '../model/User';


export default class OrderRepo {
  private static AUTHOR_DETAIL = 'name';
  private static BLOG_INFO_ADDITIONAL = '+isSubmitted +isDraft +isPublished +createdBy +updatedBy';
  private static BLOG_ALL_DATA =
    '+text +draftText +isSubmitted +isDraft +isPublished +status +createdBy +updatedBy';

    public static async createOrderItem(orderItem: OrderItem): Promise<{orderItem: OrderItem }> {
      const now = new Date();
      orderItem.createdAt = now;
      orderItem.updatedAt = now;
      const orderedItem = await OrderItemModel.create(orderItem);
      return { orderItem: orderedItem };
    }

  public static async createOrder(order: Order): Promise<{order: Order }> {
    const now = new Date();
    order.createdAt = now;
    order.updatedAt = now;
    const orderedProduct = await OrderModel.create(order);
    return { order: orderedProduct };
  }

  public static findOrderItemDataById(id: Types.ObjectId): Promise<OrderItem> {
    return OrderItemModel.findOne({ _id: id })
      .select(this.BLOG_ALL_DATA)
      .populate('author', this.AUTHOR_DETAIL)
      .populate('product', 'price')
      .lean<OrderItem>()
      .exec();
  }

  public static findAllSubmissionsForOrders(user: User): Promise<Order[]> {
    return this.findDetailedOrders({ author: user });
  }

  private static findDetailedOrders(query: Record<string, unknown>): Promise<Order[]> {
    return OrderModel.find(query)
      .populate('author' ,'name').sort({'dateOrdered':-1})
      .populate({ 
          path: 'orderItems', populate: { 
              path: 'product', populate: 'categoryIds'}
      })
      .sort({ updatedAt: -1 })
      .lean<Order[]>()
      .exec();
  }

  public static findOrderDataById(id: Types.ObjectId): Promise<Order | null> {
    return OrderModel.findOne({ _id: id })
      .select(this.BLOG_ALL_DATA)
      .populate('author', this.AUTHOR_DETAIL)
      .lean<Order>()
      .exec();
  }

  public static fetchOrderCount(user: User): Promise<any> {
    // return OrderModel.find({ author: user }).countDocuments().lean<Order>().exec();
    return OrderModel.countDocuments().lean<Order>().exec();
  }

  public static findOrderDataTotalSales(): any {
    return OrderModel.aggregate([
        { $group: {_id: null, totalsales:{ $sum :'$totalPrice'}}}
        ]);
  }

  public static fetchUserOrders(id: Types.ObjectId): Promise<Order | null> {
    return OrderModel.find({user: id})
      .populate({
          path: 'orderItems', populate: {
              path: 'product', populate: 'categoryIds'
          }
      }).sort({ 'dateOrdered': -1 })
      .lean<Order>()
      .exec();
  }

  public static update(order: Order): Promise<any> {
    order.updatedAt = new Date();
    return OrderModel.updateOne({ _id: order._id }, { $set: { ...order } })
      .lean<Order>()
      .exec();
  }

  public static delete(id: Types.ObjectId): Promise<Order> {
    return OrderModel.findByIdAndRemove(id)
      .lean<Order>()
      .exec();
  }
}
