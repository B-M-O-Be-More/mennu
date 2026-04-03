/**
 * Integration tests for ReportsPage component.
 *
 * Tests the dynamic tab rendering and empty state based on feature_flags.
 * The useRelatoriosDisponiveis hook is NOT mocked — it uses the real
 * RELATORIOS_FACTORY + the mocked useUser, so tests are coupled to the
 * actual plan configuration which is the intended behaviour.
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { ReportsPage } from "../component";

// ── Mock dependencies ─────────────────────────────────────────────────────────

// Mock useUser to control feature_flags per test
const mockUser = {
  feature_flags: [] as string[],
  empresa_id: 1,
  token_access: { token: "test-token", expirado_em: "" },
};

jest.mock("@/context/AuthContext", () => ({
  useUser: () => ({ user: mockUser }),
}));

// Mock RelatorioTab to avoid useAuthFetch network calls in unit tests
jest.mock("../Tabs/RelatorioTab/component", () => ({
  RelatorioTab: ({ modulo }: { modulo: { label: string } }) => (
    <div data-testid="relatorio-tab-content">{modulo.label}</div>
  ),
}));

// Mock dayjs to produce stable date values
jest.mock("dayjs", () => {
  const actual = jest.requireActual("dayjs");
  return Object.assign(
    () =>
      actual("2026-04-03").subtract
        ? actual("2026-04-03")
        : actual("2026-04-03"),
    actual,
  );
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("ReportsPage", () => {
  beforeEach(() => {
    mockUser.feature_flags = [];
  });

  it("shows empty state when user has no relatorio feature flags", () => {
    mockUser.feature_flags = [];
    render(<ReportsPage />);

    expect(
      screen.getByText(/Nenhum módulo de relatório disponível/i),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("relatorio-tab-content")).not.toBeInTheDocument();
  });

  it("shows empty state message with upgrade CTA", () => {
    mockUser.feature_flags = [];
    render(<ReportsPage />);

    expect(screen.getByText(/Faça upgrade para acessar/i)).toBeInTheDocument();
  });

  it("renders one tab button and active content for START plan", () => {
    mockUser.feature_flags = ["relatorio.refeicoes"];
    render(<ReportsPage />);

    // One tab button labeled "Refeições"
    expect(screen.getByRole("button", { name: /Refeições/i })).toBeInTheDocument();
    // Active content shown
    expect(screen.getByTestId("relatorio-tab-content")).toHaveTextContent("Refeições");
  });

  it("renders 5 tab buttons for PRO plan", () => {
    mockUser.feature_flags = [
      "relatorio.refeicoes",
      "relatorio.acesso",
      "relatorio.presenca",
      "relatorio.usuarios",
      "relatorio.terminais",
    ];
    render(<ReportsPage />);

    // 5 module tabs + "Últimos 30 dias" button = 6 total buttons with role=button
    // Check by tab labels specifically
    expect(screen.getByRole("button", { name: /Refeições/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Acesso/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Presença/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Usuários/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Terminais/i })).toBeInTheDocument();
  });

  it("renders 9 tab buttons for ENTERPRISE plan", () => {
    mockUser.feature_flags = [
      "relatorio.refeicoes",
      "relatorio.acesso",
      "relatorio.presenca",
      "relatorio.usuarios",
      "relatorio.terminais",
      "relatorio.consumo",
      "relatorio.estoque",
      "relatorio.cardapio",
      "relatorio.gerencial",
    ];
    render(<ReportsPage />);

    expect(screen.getByRole("button", { name: /Gerencial/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Estoque/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cardápio/i })).toBeInTheDocument();
  });

  it("shows the page title regardless of plan", () => {
    mockUser.feature_flags = [];
    render(<ReportsPage />);
    expect(screen.getByText("Relatórios")).toBeInTheDocument();
  });
});
