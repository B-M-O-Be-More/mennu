export interface FormResetPasswordProps {
  /**
   * Callback executado quando o usuário clica em "Voltar ao login"
   */
  onBack?: () => void;

  /**
   * Callback executado quando o formulário é submetido
   * @param email - Email inserido pelo usuário
   */
  onSubmit?: (email: string) => Promise<void> | void;
}