import {
  MealRuleResponse,
  MealTypeResponse,
  MealRecordsResponse,
  Unit,
  ValidationProps,
} from "@/Interfaces/Meals/MealTypes";
import { Balance, CreditCard, ErrorOutline } from "@mui/icons-material";
import { CircledCheckIcon, ClockIcon } from "@/components/Icons";
import { FiX } from "react-icons/fi";
import { InfoCardProps } from "@/components/Cards/InfoCard";

export const mealValidations: ValidationProps[] = [
  {
    id: "pesagem",
    label: "Exige Pesagem",
    shortLabel: "Pesagem",
    description: "O terminal solicitará pesagem da refeição",
    icon: <Balance sx={{ color: "#9810FA" }} />,
    chipColor: "purple",
  },
  {
    id: "cartao",
    label: "Exige Cartão",
    shortLabel: "Cartão",
    description: "Validação por cartão/NFC obrigatória",
    icon: <CreditCard sx={{ color: "#198754" }} />,
    chipColor: "success",
  },
  {
    id: "extra",
    label: "Validação Extra",
    shortLabel: "Validação Extra",
    description: "Requer confirmação adicional no terminal",
    icon: <ErrorOutline sx={{ color: "#E17100" }} />,
    chipColor: "warning",
  },
];

export const unitsMock: Unit[] = [
  { id: "1", label: "Unidade 1" },
  { id: "2", label: "Unidade 2" },
  { id: "3", label: "Unidade 3" },
  { id: "4", label: "Unidade 4" },
  { id: "5", label: "Unidade 5" },
];

export const mealTypesMock: MealTypeResponse[] = [
  {
    id: "1",
    typeName: "Café da Manhã",
    description: "Primeira refeição do dia",
    status: "ativo",
    startTime: "2026-02-04T10:00:00.000Z",
    endTime: "2026-02-04T12:00:00.000Z",
    validations: [mealValidations[1]],
    units: [unitsMock[0], unitsMock[1], unitsMock[2]],
  },
  {
    id: "2",
    typeName: "Almoço",
    description: "Refeição principal do dia",
    status: "ativo",
    startTime: "2026-02-04T14:30:00.000Z",
    endTime: "2026-02-04T17:00:00.000Z",
    validations: [mealValidations[0], mealValidations[1], mealValidations[2]],
    units: [unitsMock[0], unitsMock[1]],
  },
  {
    id: "3",
    typeName: "Jantar",
    description: "Última refeição do dia",
    status: "ativo",
    startTime: "2026-02-04T21:00:00.000Z",
    endTime: "2026-02-04T23:00:00.000Z",
    validations: [mealValidations[1]],
    units: [unitsMock[0]],
  },
  {
    id: "4",
    typeName: "Jantar",
    description: "Última refeição do dia",
    status: "inativo",
    startTime: "2026-02-04T21:00:00.000Z",
    endTime: "2026-02-04T23:00:00.000Z",
    validations: [mealValidations[0], mealValidations[2]],
    units: [unitsMock[0], unitsMock[1], unitsMock[2]],
  },
];

export const mealRulesMock: MealRuleResponse[] = [
  {
    id: "1",
    unit: unitsMock[0].label,
    dailyLimit: 3,
    weeklyLimit: 15,
    monthlyLimit: 60,
    minInterval: 240,
    isTimeRestricted: true,
  },
  {
    id: "2",
    unit: unitsMock[1].label,
    dailyLimit: 3,
    weeklyLimit: 15,
    monthlyLimit: 60,
    minInterval: 240,
    isTimeRestricted: true,
  },
  {
    id: "3",
    unit: unitsMock[2].label,
    dailyLimit: 3,
    weeklyLimit: 15,
    monthlyLimit: 60,
    minInterval: 240,
    isTimeRestricted: false,
  },
  {
    id: "4",
    unit: unitsMock[3].label,
    dailyLimit: 3,
    weeklyLimit: 15,
    monthlyLimit: 60,
    minInterval: 240,
    isTimeRestricted: false,
  },
];

export const mealInfoCards: InfoCardProps[] = [
  {
    key: "served",
    label: "Refeições Servidas",
    value: 4,
    icon: <CircledCheckIcon color="#008236" />,
    bgColor: "success.main",
  },
  {
    key: "pending",
    label: "Refeições Pendentes",
    value: 2,
    icon: <ClockIcon color="#BB4D00" />,
    bgColor: "warning.main",
  },
  {
    key: "cancelled",
    label: "Refeições Canceladas",
    value: 1,
    icon: <FiX color="#E7000B" size={24} />,
    bgColor: "error.main",
  },
];

export const mealRecordsMock: MealRecordsResponse[] = [
  {
    usuario: "João Silva",
    matricula: "12345",
    tipo: "Almoço",
    unidade: "Unidade 1",
    horario: "2025-12-03T15:30:00.000Z",
    terminal: "Terminal A",
    status: "Servida",
  },
  {
    isManual: true,
    usuario: "Maria Santos",
    matricula: "12346",
    tipo: "Almoço",
    unidade: "Unidade 2",
    horario: "2025-12-03T15:35:00.000Z",
    terminal: "Terminal B",
    status: "Pendente",
  },
  {
    usuario: "Maria Santos",
    matricula: "12346",
    tipo: "Jantar",
    unidade: "Unidade 2",
    horario: "2025-12-03T22:35:00.000Z",
    terminal: "Terminal B",
    status: "Pendente",
  },
  {
    usuario: "Maria Santos",
    matricula: "12346",
    tipo: "Almoço",
    unidade: "Unidade 2",
    horario: "2025-12-03T15:35:00.000Z",
    terminal: "Terminal C",
    status: "Cancelada",
  },
  {
    isManual: true,
    usuario: "João Silva",
    matricula: "12346",
    tipo: "Almoço",
    unidade: "Unidade 2",
    horario: "2025-12-03T15:35:00.000Z",
    terminal: "Terminal C",
    status: "Cancelada",
  },
  {
    usuario: "João Silva",
    matricula: "12345",
    tipo: "Café",
    unidade: "Unidade 1",
    horario: "2025-12-03T21:30:00.000Z",
    terminal: "Terminal A",
    status: "Servida",
  },
];
