import Category, { CategoryModel } from '../model/Category';
import { Types } from 'mongoose';
import User from '../model/User';

export default class CategoryRepo {
  private static AUTHOR_DETAIL = 'name';
  private static BLOG_INFO_ADDITIONAL = '+isSubmitted +isDraft +isPublished +createdBy +updatedBy';
  private static BLOG_ALL_DATA =
    '+text +draftText +isSubmitted +isDraft +isPublished +status +createdBy +updatedBy';

  public static async create(category: Category): Promise<{category: Category }> {
    const now = new Date();
    category.createdAt = now;
    category.updatedAt = now;
    const createdProduct = await CategoryModel.create(category);
    return { category: createdProduct };
  }

  public static findAllSubmissionsForCategories(user: User): Promise<Category[]> {
    return this.findDetailedCategories({ author: user, status: true });
  }

  private static findDetailedCategories(query: Record<string, unknown>): Promise<Category[]> {
    return CategoryModel.find(query)
      .select(this.BLOG_INFO_ADDITIONAL)
      .populate('author', this.AUTHOR_DETAIL)
      .populate('createdBy', this.AUTHOR_DETAIL)
      .populate('updatedBy', this.AUTHOR_DETAIL)
      .sort({ updatedAt: -1 })
      .lean<Category[]>()
      .exec();
  }

  public static findCategoryAllDataById(id: Types.ObjectId): Promise<Category | null> {
    return CategoryModel.findOne({ _id: id })
      .select(this.BLOG_ALL_DATA)
      .populate('author', this.AUTHOR_DETAIL)
      .lean<Category>()
      .exec();
  }

  public static update(category: Category): Promise<any> {
    category.updatedAt = new Date();
    return CategoryModel.updateOne({ _id: category._id }, { $set: { ...category } })
      .lean<Category>()
      .exec();
  }

  public static delete(id: Types.ObjectId): Promise<any> {
    return CategoryModel.findByIdAndRemove(id)
      .lean<Category>()
      .exec();
  }
}
