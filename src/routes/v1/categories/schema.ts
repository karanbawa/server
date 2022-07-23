import Joi from '@hapi/joi';
import { JoiObjectId, JoiUrlEndpoint } from '../../../helpers/validator';

export default {
  categoryId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
};
