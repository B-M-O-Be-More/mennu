/**
 * Unit tests for RELATORIOS_FACTORY and the filtering logic used by
 * useRelatoriosDisponiveis.
 *
 * These tests run in pure Node (no React/DOM) so they're fast.
 */
import { RELATORIOS_FACTORY } from "../relatorios-factory";

function filterByFlags(flags: string[]) {
  return RELATORIOS_FACTORY.filter((m) => flags.includes(m.featureFlag));
}

describe("RELATORIOS_FACTORY", () => {
  it("contains exactly 9 modules", () => {
    expect(RELATORIOS_FACTORY).toHaveLength(9);
  });

  it("every module has a non-empty id, label, featureFlag and endpoint", () => {
    for (const m of RELATORIOS_FACTORY) {
      expect(m.id).toBeTruthy();
      expect(m.label).toBeTruthy();
      expect(m.featureFlag).toBeTruthy();
      expect(m.previewEndpoint).toBeTruthy();
      expect(m.exportEndpoint).toBeTruthy();
    }
  });

  it("all featureFlags are unique", () => {
    const flags = RELATORIOS_FACTORY.map((m) => m.featureFlag);
    expect(new Set(flags).size).toBe(flags.length);
  });
});

describe("filterByFlags (simulates useRelatoriosDisponiveis)", () => {
  it("returns empty array when flags is empty (no plan)", () => {
    expect(filterByFlags([])).toHaveLength(0);
  });

  it("START plan: only relatorio.refeicoes is available", () => {
    const result = filterByFlags(["relatorio.refeicoes"]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("refeicoes");
  });

  it("PRO plan: 5 modules (refeicoes + acesso + presenca + usuarios + terminais)", () => {
    const proFlags = [
      "relatorio.refeicoes",
      "relatorio.acesso",
      "relatorio.presenca",
      "relatorio.usuarios",
      "relatorio.terminais",
    ];
    const result = filterByFlags(proFlags);
    expect(result).toHaveLength(5);
    const ids = result.map((m) => m.id);
    expect(ids).toContain("refeicoes");
    expect(ids).toContain("acesso");
    expect(ids).toContain("presenca");
    expect(ids).toContain("usuarios");
    expect(ids).toContain("terminais");
  });

  it("BUSINESS plan: 8 modules (PRO + consumo + estoque + cardapio)", () => {
    const businessFlags = [
      "relatorio.refeicoes",
      "relatorio.acesso",
      "relatorio.presenca",
      "relatorio.usuarios",
      "relatorio.terminais",
      "relatorio.consumo",
      "relatorio.estoque",
      "relatorio.cardapio",
    ];
    const result = filterByFlags(businessFlags);
    expect(result).toHaveLength(8);
  });

  it("ENTERPRISE plan: all 9 modules", () => {
    const allFlags = RELATORIOS_FACTORY.map((m) => m.featureFlag);
    const result = filterByFlags(allFlags);
    expect(result).toHaveLength(9);
  });

  it("unrelated flags produce no modules", () => {
    const result = filterByFlags([
      "estoque.ativo",
      "cardapio.basico",
      "terminal.acesso.turno",
    ]);
    expect(result).toHaveLength(0);
  });
});
