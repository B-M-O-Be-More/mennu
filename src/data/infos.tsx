import { GeneralTab, PoliciesTab, SecurityTab, TerminalsTab, UnitsTab } from "@/components/SettingsTabs";
import { AlertIcon, BuildingIcon, LockIcon, TwistedArrowIcon, UsuariosCheckIcon, UsuariosXIcon } from "../components/Icons";
import { CardapiosIcon, ConfiguracoesIcon, EstoqueIcon, PerfisPermissoesIcon, RefeicoesIcon, RelatoriosIcon, TerminalIcon, UsuariosIcon } from "../components/Sidebar/icons";

const cardsUsers = [
  {
    title: "Total Usuários",
    value: 0,
    icon: <UsuariosIcon color="#155DFC" />,
    bgColor: "#EFF6FF",
  },
  {
    title: "Usuários Ativos",
    value: 0,
    icon: <UsuariosCheckIcon color="#00A63E" />,
    bgColor: "#F0FDF4",
  },
  {
    title: "Total Inativos",
    value: 0,
    icon: <UsuariosXIcon color="#E7000B" />,
    bgColor: "#FEF2F2",
  },
  {
    title: "Administradores",
    value: 0,
    icon: <UsuariosIcon color="#9810FA" />,
    bgColor: "#FAF5FF",
  },
];

const cardsModules = [
  {
    title: "Cardápios",
    subtitle: "Acesse o módulo",
    link: "/cardapios",
    icon: <CardapiosIcon color="#155DFC" />,
    iconBgColor: "#EFF6FF",
  },
  {
    title: "Estoque",
    subtitle: "Acesse o módulo",
    link: "/estoque",
    icon: <EstoqueIcon color="#9810FA" />,
    iconBgColor: "#FAF5FF",
  },
  {
    title: "Refeições",
    subtitle: "Acesse o módulo",
    link: "/refeicoes",
    icon: <RefeicoesIcon color="#009689" />,
    iconBgColor: "#F0FDFA",
  },
  {
    title: "Relatórios",
    subtitle: "Acesse o módulo",
    link: "/relatorios",
    icon: <RelatoriosIcon color="#EC003F" />,
    iconBgColor: "#FFF1F2",
  },
  {
    title: "Usuários",
    subtitle: "Acesse o módulo",
    link: "/usuarios",
    icon: <UsuariosIcon color="#E17100" />,
    iconBgColor: "#FFBEB",
  },
];

const cardsStock = [
  {
    title: "Total de Itens",
    subtitle: "Ativos no sistema",
    value: 0,
    icon: <EstoqueIcon color="#00A63E" />,
    bgColor: "#F0FDF4",
  },
  {
    title: "Itens Críticos",
    subtitle: "Abaixo do mínimo",
    value: 0,
    icon: <AlertIcon color="#E7000B" />,
    bgColor: "#FEF2F2",
  },
  {
    title: "Movimentações",
    subtitle: "Últimos 7 dias",
    value: 0,
    icon: <TwistedArrowIcon color="#155DFC" />,
    bgColor: "#EFF6FF",
  },
];

const tabsSettings = [
  {
    label: "Geral",
    icon: <ConfiguracoesIcon width={22} height={22} />,
    tabComponent: <GeneralTab />,
  },
  {
    label: "Unidades",
    icon: <BuildingIcon width={22} height={22} />,
    tabComponent: <UnitsTab />,
  },
  {
    label: "Terminais",
    icon: <TerminalIcon width={22} height={22} />,
    tabComponent: <TerminalsTab />,
  },
  {
    label: "Políticas",
    icon: <PerfisPermissoesIcon width={22} height={22} />,
    tabComponent: <PoliciesTab />,
  },
  {
    label: "Segurança",
    icon: <LockIcon width={22} height={22} />,
    tabComponent: <SecurityTab />,
  },
];


export { cardsUsers, cardsModules, cardsStock, tabsSettings }