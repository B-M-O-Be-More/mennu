import React from "react";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { normalizeLogAuditStatus } from "@/utils/logAuditUtils";

export function getLogAuditStatusConfig(status?: string | null) {
  switch (normalizeLogAuditStatus(status)) {
    case "sucesso":
      return {
        label: "Sucesso",
        icon: <CheckCircleOutlineRoundedIcon sx={{ fontSize: 18, color: "#00A63E" }} />,
        iconBg: "#F0FDF4",
        chipSx: { bgcolor: "#F0FDF4", color: "#00A63E", borderColor: "#B9F8CF" },
        bannerSx: { bgcolor: "#F0FDF4", borderColor: "#B9F8CF" },
        headingColor: "#008236",
        bodyColor: "#00A63E",
        statIcon: <CheckCircleOutlineRoundedIcon sx={{ fontSize: 28, color: "#00A63E" }} />,
        statBg: "#F0FDF4",
      };
    case "erro":
      return {
        label: "Erro",
        icon: <ErrorOutlineRoundedIcon sx={{ fontSize: 18, color: "#E7000B" }} />,
        iconBg: "#FEF2F2",
        chipSx: { bgcolor: "#FEF2F2", color: "#E7000B", borderColor: "#FFC9C9" },
        bannerSx: { bgcolor: "#FEF2F2", borderColor: "#FFC9C9" },
        headingColor: "#C10007",
        bodyColor: "#E7000B",
        statIcon: <ErrorOutlineRoundedIcon sx={{ fontSize: 28, color: "#E7000B" }} />,
        statBg: "#FEF2F2",
      };
    case "aviso":
      return {
        label: "Aviso",
        icon: <WarningAmberRoundedIcon sx={{ fontSize: 18, color: "#E17100" }} />,
        iconBg: "#FFFBEB",
        chipSx: { bgcolor: "#FFFBEB", color: "#BB4D00", borderColor: "#FEE685" },
        bannerSx: { bgcolor: "#FFFBEB", borderColor: "#FEE685" },
        headingColor: "#BB4D00",
        bodyColor: "#E17100",
        statIcon: <WarningAmberRoundedIcon sx={{ fontSize: 28, color: "#E17100" }} />,
        statBg: "#FFFBEB",
      };
    default:
      return {
        label: status || "Indefinido",
        icon: <InfoOutlinedIcon sx={{ fontSize: 18, color: "#155DFC" }} />,
        iconBg: "#EFF6FF",
        chipSx: { bgcolor: "#EFF6FF", color: "#155DFC", borderColor: "#BEDBFF" },
        bannerSx: { bgcolor: "#EFF6FF", borderColor: "#BEDBFF" },
        headingColor: "#1C398E",
        bodyColor: "#155DFC",
        statIcon: <InfoOutlinedIcon sx={{ fontSize: 28, color: "#155DFC" }} />,
        statBg: "#EFF6FF",
      };
  }
}
