import {
  MealRuleResponse,
  MealTypeResponse,
  Unit,
  ValidationProps,
} from "@/Interfaces/Meals/MealTypes";
import { Balance, CreditCard, ErrorOutline } from "@mui/icons-material";

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
    startTime: "07:00",
    endTime: "09:00",
    validations: [mealValidations[1]],
    units: [unitsMock[0], unitsMock[1], unitsMock[2]],
  },
  {
    id: "2",
    typeName: "Almoço",
    description: "Refeição principal do dia",
    status: "ativo",
    startTime: "11:30",
    endTime: "14:00",
    validations: [mealValidations[0], mealValidations[1], mealValidations[2]],
    units: [unitsMock[0], unitsMock[1]],
  },
  {
    id: "3",
    typeName: "Jantar",
    description: "Última refeição do dia",
    status: "ativo",
    startTime: "18:00",
    endTime: "20:00",
    validations: [mealValidations[1]],
    units: [unitsMock[0]],
  },
  {
    id: "4",
    typeName: "Jantar",
    description: "Última refeição do dia",
    status: "inativo",
    startTime: "18:00",
    endTime: "20:00",
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
