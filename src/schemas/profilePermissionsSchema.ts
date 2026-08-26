import * as yup from "yup";

export const profilePermissionsSchema = yup.object({
  nome: yup
    .string()
    .required("O nome é obrigatório")
    .min(3, "O nome deve ter pelo menos 3 caracteres"),

  descricao: yup
    .string()
    .required("A descrição é obrigatória"),

  permissoes: yup.array().of(
    yup.object({
      modulo: yup.string().required("O módulo é obrigatório"),
      label: yup.string().optional(),
      visualizar: yup.boolean().required(),
      criar: yup.boolean().required(),
      editar: yup.boolean().required(),
      excluir: yup.boolean().required(),
    })
  ).required(),
});

export type ProfilePermissionsFormData = yup.InferType<typeof profilePermissionsSchema>;
