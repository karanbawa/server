import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
  orderId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  userId: Joi.object().keys({
    userid: JoiObjectId().required(),
  }),
};
