import * as yup from "yup";

export const registerSchema = yup.object({
  name: yup.string().required(),
  document: yup.string().required(),
  birthdate: yup.string().required(),
  phone: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).max(20).required(),
});

export type RegisterSchemaType = yup.InferType<typeof registerSchema>;
