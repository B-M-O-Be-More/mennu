import { useUser } from "@/context/AuthContext";
import {
  RELATORIOS_FACTORY,
  RelatorioModulo,
} from "@/config/relatorios-factory";

/**
 * Retorna apenas os módulos de relatório disponíveis para o tenant
 * com base nas feature_flags do plano ativo.
 *
 * A lista é derivada do RELATORIOS_FACTORY filtrado pelas flags
 * presentes em user.feature_flags — sem chamada de rede adicional.
 */
export function useRelatoriosDisponiveis(): RelatorioModulo[] {
  const { user } = useUser();
  return RELATORIOS_FACTORY.filter((m) =>
    user.feature_flags.includes(m.featureFlag),
  );
}
