import mongoose from 'mongoose';
import Logger from '../core/Logger';
import { db } from '../config';
import { UserModel } from './model/User';
import { ApiKeyModel } from './model/ApiKey';
import { RoleModel } from './model/Role';

// Build the connection string
const dbURI = `mongodb+srv://${db.user}:${db.password}@cluster0.fod1g.mongodb.net/${db.name}?retryWrites=true&w=majority`;

const options = {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
  autoIndex: true,
  // poolSize: 10, // Maintain up to 10 socket connections
  // // If not connected, return errors immediately rather than waiting for reconnect
  // bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

Logger.debug(dbURI);

// Create the database connection
mongoose
  .connect(dbURI, options)
  .then(() => {
    Logger.info('Mongoose connection done');
  })
  .catch((e) => {
    Logger.info('Mongoose connection error');
    Logger.error(e);
  });

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', (db) => {
  Logger.info('Mongoose default connection open to ' + dbURI);
   UserModel.create({
    firstName: 'karan',
    lastName: 'bawa',
    email: 'karanbawab1@gmail.com',
    phoneNumber: 8588938349,
    password: 'Karanbawab1@',
    createdAt: new Date(),
    updatedAt: new Date()
   });

   ApiKeyModel.create({
    key: 'GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj',
    version: 1,
    metadata: 'To be used by the karan vendor',
    status: true,
    createdAt: new Date(),
    updatedAt: new Date(),
   });
   RoleModel.insertMany(
    [
      { code: 'LEARNER', status: true, createdAt: new Date(), updatedAt: new Date() },
      { code: 'SUB ADMIN', status: true, createdAt: new Date(), updatedAt: new Date() },
      { code: 'ADMIN', status: true, createdAt: new Date(), updatedAt: new Date() },
      { code: 'SUPER ADMIN', status: true, createdAt: new Date(), updatedAt: new Date() },
    ]
   )
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  Logger.error('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  Logger.info('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    Logger.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
