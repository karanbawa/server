import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
  userId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  profile: Joi.object().keys({
    firstName: Joi.string().required().min(3),
    lastName: Joi.string().required().min(3),
    phoneNumber: Joi.string().required().min(10).max(10),
  }),
  emailId: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
  
};
