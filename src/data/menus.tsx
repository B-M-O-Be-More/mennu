import { IConsumptionHistory, IMenu, IMenuItems, IReportMenu } from "@/Interfaces/Menu/menu";

export const restricoesMock: { id: string, label: string }[] = [
  { id: "1", label: "Vegetariano" },
  { id: "2", label: "Vegano" },
  { id: "3", label: "Sem Glúten" },
  { id: "4", label: "Sem Lactose" },
];

export const mockMenus: IMenu[] = [
  {
    id: 1,
    data: "2026-02-10",
    unidade: "Unidade Salvador",
    tipo: "almoço",
    horario: {
      inicio: "11:30",
      fim: "13:30"
    },
    refeicoes: [],
    status: "ativo",
  },
  {
    id: 2,
    data: "2026-02-11",
    unidade: "Unidade Salvador",
    tipo: "jantar",
    horario: {
      inicio: "18:30",
      fim: "20:30"
    },
    refeicoes: [],
    status: "programado",
  },
  {
    id: 3,
    data: "2026-02-08",
    unidade: "Unidade Feira de Santana",
    tipo: "almoço",
    horario: {
      inicio: "11:30",
      fim: "13:30"
    },
    refeicoes: [],
    status: "finalizado",
  },
  {
    id: 4,
    data: "2026-02-12",
    unidade: "Unidade Lauro de Freitas",
    tipo: "jantar",
    horario: {
      inicio: "18:30",
      fim: "20:30"
    },
    refeicoes: [],
    status: "programado",
  },
  {
    id: 5,
    data: "2026-02-09",
    unidade: "Unidade Camaçari",
    tipo: "almoço",
    horario: {
      inicio: "11:30",
      fim: "13:30"
    },
    refeicoes: [],
    status: "finalizado",
  },
  {
    id: 6,
    data: "2026-02-08",
    unidade: "Unidade Feira de Santana",
    tipo: "almoço",
    horario: {
      inicio: "11:30",
      fim: "13:30"
    },
    refeicoes: [],
    status: "finalizado",
  },
  {
    id: 7,
    data: "2026-02-12",
    unidade: "Unidade Lauro de Freitas",
    tipo: "jantar",
    horario: {
      inicio: "18:30",
      fim: "20:30"
    },
    refeicoes: [],
    status: "programado",
  },
  {
    id: 8,
    data: "2026-02-09",
    unidade: "Unidade Camaçari",
    tipo: "almoço",
    horario: {
      inicio: "11:30",
      fim: "13:30"
    },
    refeicoes: [],
    status: "finalizado",
  },
];

export const mockMenuItems: IMenuItems[] = [
  {
    id: 1,
    categoria: "prato principal",
    nome: "Arroz com feijão",
    descricao: "Arroz branco com feijão preto temperado",
    restricoes: ["vegetariano"],
    status: "ativo",
  },
  {
    id: 2,
    categoria: "acompanhamento",
    nome: "Salada de alface",
    descricao: "Alface fresca com molho vinagrete",
    restricoes: ["vegano", "sem glúten"],
    status: "ativo",
  },
  {
    id: 3,
    categoria: "sobremesa",
    nome: "Pudim de leite",
    descricao: "Pudim cremoso feito com leite condensado",
    restricoes: ["vegetariano"],
    status: "inativo",
  },
  {
    id: 4,
    categoria: "bebida",
    nome: "Suco de laranja",
    descricao: "Suco natural de laranja espremida na hora",
    restricoes: ["vegano", "sem glúten"],
    status: "ativo",
  },
  {
    id: 5,
    categoria: "prato principal",
    nome: "Frango grelhado",
    descricao: "Peito de frango temperado e grelhado",
    restricoes: ["sem glúten"],
    status: "ativo",
  },
  {
    id: 6,
    categoria: "acompanhamento",
    nome: "Purê de batata",
    descricao: "Purê cremoso de batata com manteiga",
    restricoes: ["vegetariano"],
    status: "inativo",
  },
  {
    id: 7,
    categoria: "sobremesa",
    nome: "Mousse de chocolate",
    descricao: "Mousse leve e aerada feita com chocolate meio amargo",
    restricoes: ["vegetariano"],
    status: "ativo",
  },
  {
    id: 8,
    categoria: "bebida",
    nome: "Água mineral",
    descricao: "Água mineral sem gás",
    restricoes: ["vegano", "sem glúten"],
    status: "ativo",
  },
];

export const mockReportsMenu: IReportMenu[] = [
  {
    id: 1,
    data: "2026-02-01",
    planejado: 120,
    realizado: 110,
    variacao: -8,
    eficiencia: 75,
    categoria: "prato principal",
  },
  {
    id: 2,
    data: "2026-02-02",
    planejado: 80,
    realizado: 95,
    variacao: 18,
    eficiencia: 88,
    categoria: "acompanhamento",
  },
  {
    id: 3,
    data: "2026-02-03",
    planejado: 60,
    realizado: 60,
    variacao: 0,
    eficiencia: 100,
    categoria: "sobremesa",
  },
  {
    id: 4,
    data: "2026-02-04",
    planejado: 50,
    realizado: 40,
    variacao: -20,
    eficiencia: 65,
    categoria: "bebida",
  },
  {
    id: 5,
    data: "2026-02-05",
    planejado: 70,
    realizado: 85,
    variacao: 21,
    eficiencia: 92,
    categoria: "salada",
  },
];

export const mockConsumptionHistory: IConsumptionHistory[] = [
  {
    id: 1,
    user: {
      id: 1,
      nome: "João Silva",
      matricula: "123456",
    },
    data: "2026-02-10",
    horario: "12:30",
    refeicao: {
      id: 1,
      categoria: "prato principal",
      nome: "Arroz com Feijão",
      descricao: "Arroz branco com feijão preto temperado.",
      restricoes: ["vegetariano", "sem glúten"],
      status: "ativo",
    },
    status: "liberado",
    tipo: "automático",
  },
  {
    id: 2,
    user: {
      id: 2,
      nome: "Maria Oliveira",
      matricula: "654321",
    },
    data: "2026-02-10",
    horario: "12:45",
    refeicao: {
      id: 2,
      categoria: "acompanhamento",
      nome: "Salada de Alface",
      descricao: "Alface fresca com molho vinagrete.",
      restricoes: ["vegano", "sem lactose"],
      status: "ativo",
    },
    status: "bloqueado",
    tipo: "manual",
  },
  {
    id: 3,
    user: {
      id: 3,
      nome: "Carlos Pereira",
      matricula: "789012",
    },
    data: "2026-02-10",
    horario: "13:00",
    refeicao: {
      id: 3,
      categoria: "sobremesa",
      nome: "Pudim de Leite",
      descricao: "Pudim cremoso de leite condensado.",
      restricoes: ["sem glúten"],
      status: "ativo",
    },
    status: "liberado",
    tipo: "automático",
  },
  {
    id: 4,
    user: {
      id: 4,
      nome: "Ana Santos",
      matricula: "345678",
    },
    data: "2026-02-10",
    horario: "13:15",
    refeicao: {
      id: 4,
      categoria: "bebida",
      nome: "Suco de Laranja",
      descricao: "Suco natural de laranja espremida na hora.",
      restricoes: ["vegano", "sem lactose"],
      status: "ativo",
    },
    status: "liberado",
    tipo: "manual",
  }
]