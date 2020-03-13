import * as yup from 'yup';
import { imageModelSchema } from './image.model';

export const productModelSchema = yup.object({
  name: yup.string().required(),
  description: yup.string(),
  shortDescription: yup.string(),
  subline: yup.string(),
  images: yup.array(imageModelSchema),
});

export type ProductModel = yup.InferType<typeof productModelSchema>;
