import * as yup from 'yup';

export const imageModelSchema = yup.object({
  id: yup.string().required(),
  originId: yup.string().required(),
  ext: yup.string().required(),
});

export type ImageModel = yup.InferType<typeof imageModelSchema>;
