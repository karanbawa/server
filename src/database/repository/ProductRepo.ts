import Product, { ProductModel } from '../model/Product';
import { Types } from 'mongoose';
import User from '../model/User';

export default class ProductRepo {
  private static AUTHOR_DETAIL = 'name';
  private static BLOG_INFO_ADDITIONAL = '+isSubmitted +isDraft +isPublished +createdBy +updatedBy';
  private static BLOG_ALL_DATA =
    '+text +draftText +isSubmitted +isDraft +isPublished +status +createdBy +updatedBy';

  public static async create(product: Product): Promise<{product: Product }> {
    const now = new Date();
    product.createdAt = now;
    product.updatedAt = now;
    const createdProduct = await ProductModel.create(product);
    return { product: createdProduct };
  }

  public static update(product: Product): Promise<any> {
    product.updatedAt = new Date();
    return ProductModel.updateOne({ _id: product._id }, { $set: { ...product } })
      .lean<Product>()
      .exec();
  }

  public static deleteOne(product: Product): Promise<any> {
    product.updatedAt = new Date();
    return ProductModel.deleteOne({ _id: product._id })
      .lean<Product>()
      .exec();
  }

  public static deleteMany(query: Record<string, unknown>): Promise<any> {
    query.updatedAt = new Date();
    return ProductModel.deleteMany({})
      .lean<Product>()
      .exec();
  }
  
  public static findInfoById(id: Types.ObjectId): Promise<Product | null> {
    return ProductModel.findOne({ _id: id, status: true })
      .populate('author', this.AUTHOR_DETAIL)
      .lean<Product>()
      .exec();
  }

  // public static findInfoWithTextById(id: Types.ObjectId): Promise<Blog | null> {
  //   return BlogModel.findOne({ _id: id, status: true })
  //     .select('+text')
  //     .populate('author', this.AUTHOR_DETAIL)
  //     .lean<Blog>()
  //     .exec();
  // }

  // public static findInfoWithTextAndDraftTextById(id: Types.ObjectId): Promise<Blog | null> {
  //   return BlogModel.findOne({ _id: id, status: true })
  //     .select('+text +draftText +isSubmitted +isDraft +isPublished +status')
  //     .populate('author', this.AUTHOR_DETAIL)
  //     .lean<Blog>()
  //     .exec();
  // }

  public static findProductAllDataById(id: Types.ObjectId): Promise<Product | null> {
    return ProductModel.findOne({ _id: id })
      .select(this.BLOG_ALL_DATA)
      .populate('author', this.AUTHOR_DETAIL)
      .lean<Product>()
      .exec();
  }

  // public static findByUrl(blogUrl: string): Promise<Blog | null> {
  //   return BlogModel.findOne({ blogUrl: blogUrl, status: true })
  //     .select('+text')
  //     .populate('author', this.AUTHOR_DETAIL)
  //     .lean<Blog>()
  //     .exec();
  // }

  // public static findUrlIfExists(blogUrl: string): Promise<Blog | null> {
  //   return BlogModel.findOne({ blogUrl: blogUrl }).lean<Blog>().exec();
  // }

  // public static findByTagAndPaginated(
  //   tag: string,
  //   pageNumber: number,
  //   limit: number,
  // ): Promise<Blog[]> {
  //   return BlogModel.find({ tags: tag, status: true, isPublished: true })
  //     .skip(limit * (pageNumber - 1))
  //     .limit(limit)
  //     .populate('author', this.AUTHOR_DETAIL)
  //     .sort({ updatedAt: -1 })
  //     .lean<Blog>()
  //     .exec();
  // }

  // public static findAllPublishedForAuthor(user: User): Promise<Blog[]> {
  //   return BlogModel.find({ author: user, status: true, isPublished: true })
  //     .populate('author', this.AUTHOR_DETAIL)
  //     .sort({ updatedAt: -1 })
  //     .lean<Blog>()
  //     .exec();
  // }

  // public static findAllDrafts(): Promise<Blog[]> {
  //   return this.findDetailedBlogs({ isDraft: true, status: true });
  // }

  // public static findAllSubmissions(): Promise<Blog[]> {
  //   return this.findDetailedBlogs({ isSubmitted: true, status: true });
  // }

  // public static findAllPublished(): Promise<Blog[]> {
  //   return this.findDetailedBlogs({ isPublished: true, status: true });
  // }

  public static findAllSubmissionsForProducts(user: User): Promise<Product[]> {
    return this.findDetailedProducts({ author: user, status: true });
  }

  // public static findAllPublishedForWriter(user: User): Promise<Blog[]> {
  //   return this.findDetailedBlogs({ author: user, status: true, isPublished: true });
  // }

  // public static findAllDraftsForWriter(user: User): Promise<Blog[]> {
  //   return this.findDetailedBlogs({ author: user, status: true, isDraft: true });
  // }

  private static findDetailedProducts(query: Record<string, unknown>): Promise<Product[]> {
    return ProductModel.find(query)
      .select(this.BLOG_INFO_ADDITIONAL)
      .populate('author', this.AUTHOR_DETAIL)
      .populate('createdBy', this.AUTHOR_DETAIL)
      .populate('updatedBy', this.AUTHOR_DETAIL)
      .sort({ updatedAt: -1 })
      .lean<Product[]>()
      .exec();
  }

  // public static findLatestBlogs(pageNumber: number, limit: number): Promise<Blog[]> {
  //   return BlogModel.find({ status: true, isPublished: true })
  //     .skip(limit * (pageNumber - 1))
  //     .limit(limit)
  //     .populate('author', this.AUTHOR_DETAIL)
  //     .sort({ publishedAt: -1 })
  //     .lean<Blog>()
  //     .exec();
  // }

  // public static searchSimilarBlogs(blog: Blog, limit: number): Promise<Blog[]> {
  //   return BlogModel.find(
  //     {
  //       $text: { $search: blog.title, $caseSensitive: false },
  //       status: true,
  //       isPublished: true,
  //       _id: { $ne: blog._id },
  //     },
  //     {
  //       similarity: { $meta: 'textScore' },
  //     },
  //   )
  //     .populate('author', this.AUTHOR_DETAIL)
  //     .sort({ updatedAt: -1 })
  //     .limit(limit)
  //     .sort({ similarity: { $meta: 'textScore' } })
  //     .lean<Blog>()
  //     .exec();
  // }

  // public static search(query: string, limit: number): Promise<Blog[]> {
  //   return BlogModel.find(
  //     {
  //       $text: { $search: query, $caseSensitive: false },
  //       status: true,
  //       isPublished: true,
  //     },
  //     {
  //       similarity: { $meta: 'textScore' },
  //     },
  //   )
  //     .select('-status -description')
  //     .limit(limit)
  //     .sort({ similarity: { $meta: 'textScore' } })
  //     .lean<Blog>()
  //     .exec();
  // }

  // public static searchLike(query: string, limit: number): Promise<Blog[]> {
  //   return BlogModel.find({
  //     title: { $regex: `.*${query}.*`, $options: 'i' },
  //     status: true,
  //     isPublished: true,
  //   })
  //     .select('-status -description')
  //     .limit(limit)
  //     .sort({ score: -1 })
  //     .lean<Blog>()
  //     .exec();
  // }
}
