import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
  categoryId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
};
