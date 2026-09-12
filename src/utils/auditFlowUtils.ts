import { IUserContext } from "@/Interfaces/User/context";

/**
 * A auditoria de estoque tem dois fluxos, escolhidos pelo cargo do usuário
 * no contexto ativo:
 *
 * - `nutricionista`: acompanha a auditoria em andamento (somente leitura);
 * - `auditor`: preenche o checklist em campo.
 *
 * Administrador (ou qualquer cargo com acesso total) vê os dois e escolhe.
 */
export type AuditFlow = "nutricionista" | "auditor";

/** Termos que identificam o cargo de cada fluxo, sem acento e em minúsculo. */
const FLOW_ROLE_MATCHERS: Record<AuditFlow, string[]> = {
  nutricionista: ["nutricionista"],
  auditor: ["auditor"],
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/** Nomes dos cargos do contexto ativo, normalizados. */
export function getContextCargoNames(context?: IUserContext | null): string[] {
  return (context?.cargos ?? []).map((cargo) => normalize(cargo.nome));
}

/**
 * O usuário exerce o cargo do fluxo no contexto ativo. A comparação é por
 * trecho do nome porque a API não expõe um código de cargo — só o rótulo
 * cadastrado pela empresa ("Auditor", "Auditor de Estoque", …).
 */
export function hasAuditFlowRole(
  context: IUserContext | null | undefined,
  flow: AuditFlow,
): boolean {
  const names = getContextCargoNames(context);
  return names.some((name) =>
    FLOW_ROLE_MATCHERS[flow].some((matcher) => name.includes(matcher)),
  );
}
