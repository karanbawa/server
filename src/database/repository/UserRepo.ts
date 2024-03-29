import User, { UserModel } from '../model/User';
import Role, { RoleModel } from '../model/Role';
import { InternalError } from '../../core/ApiError';
import { Types } from 'mongoose';
import KeystoreRepo from './KeystoreRepo';
import Keystore from '../model/Keystore';

export default class UserRepo {
  // contains critical information of the userw
  public static findById(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findOne({ _id: id, status: true })
      .select('+email +password +roles')
      .populate({
        path: 'roles',
        match: { status: true },
      })
      .lean<User>()
      .exec();
  }

  public static findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email: email, status: true })
      .select('+email +password +roles')
      .populate({
        path: 'roles',
        match: { status: true },
        select: { code: 1 },
      })
      .lean<User>()
      .exec();
  }

  public static findProfileById(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findOne({ _id: id, status: true })
      .select('+roles')
      .populate({
        path: 'roles',
        match: { status: true },
        select: { code: 1 },
      })
      .lean<User>()
      .exec();
  }

  public static findInactiveProfile(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findOne({ _id: id, deleted: true })
      .select('+roles')
      .populate({
        path: 'roles',
        match: { deleted: true },
        select: { code: 1 },
      })
      .lean<User>()
      .exec();
  }

  public static findPublicProfileById(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findOne({ _id: id, status: true }).lean<User>().exec();
  }

  public static countUsers(): Promise<any> {
    return UserModel.countDocuments().lean().exec();
  }

  public static async create(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
    roleCode: string,
  ): Promise<{ user: User; keystore: Keystore }> {
    const now = new Date();

    const role = await RoleModel.findOne({ code: roleCode })
      .select('+email +password')
      .lean<Role>()
      .exec();
    if (!role) throw new InternalError('Role must be defined');

    user.roles = [role._id];
    user.createdAt = user.updatedAt = now;
    const createdUser = await UserModel.create(user);
    const keystore = await KeystoreRepo.create(createdUser._id, accessTokenKey, refreshTokenKey);
    return { user: createdUser, keystore: keystore };
  }

  public static async update(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
  ): Promise<{ user: User; keystore: Keystore }> {
    user.updatedAt = new Date();
    await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
      .lean()
      .exec();
    const keystore = await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey);
    return { user: user, keystore: keystore };
  }

  public static updateInfo(user: User): Promise<User> {
    user.updatedAt = new Date();
    return UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
      .lean<User>()
      .exec();
  }

  public static findAllUsersList(): Promise<User[]> {
    return UserModel.find()
    .select('+roles')
    .populate({
      path: 'roles',
      match: { status: true },
      select: { code: 1 },
    })
    .lean<User[]>()
    .exec();
  }

  public static deleteOne(id: Types.ObjectId, user: User): Promise<any> {
    return UserModel.updateOne({ _id: id }, { $set: { ...user, deleted: true } })
      .lean()
      .exec();
  }

  public static activatUserStatus(user: User): Promise<User> {
    return UserModel.updateOne({ _id: user._id }, { $set: { ...user, deleted: true } })
      .select('+roles')
      .populate({
        path: 'roles',
        match: { status: true },
        select: { code: 1 },
      })
      .lean<User>()
      .exec();
  }
}
