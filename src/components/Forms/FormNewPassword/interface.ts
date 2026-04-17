export interface FormNewPasswordProps {
  emailMascarado: string;
  onSubmit: (nova: string, confirma: string) => Promise<void>;
  loading: boolean;
}