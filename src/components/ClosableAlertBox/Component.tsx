import React from "react";
import { Stack, Typography, IconButton, Collapse } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconBox from "../Cards/IconBox";
import { ClosableAlertBoxProps } from "./";

export default function ClosableAlertBox({
  severity,
  icon,
  title,
  description,
  isCloseable = true,
}: ClosableAlertBoxProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Collapse
      in={isOpen}
      timeout={600}
      easing="ease-in-out"
    >
      <Stack
        direction="row"
        border="1px solid"
        borderColor={`${severity}.light`}
        borderRadius={3}
        padding={2}
        gap={2}
        bgcolor={`${severity}.main`}
        alignItems="flex-start"
      >
        <IconBox icon={icon} bgColor="transparent" padding={0} borderRadius={0} />

        <Stack flex={1}>
          <Typography variant="body1" color={`${severity}.dark`}>
            {title}
          </Typography>
          <Typography variant="body2" color={`${severity}.contrastText`}>
            {description}
          </Typography>
        </Stack>

        {isCloseable && (
          <IconButton
            size="small"
            onClick={() => setIsOpen(false)}
            sx={{ color: `${severity}.contrastText` }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Stack>
    </Collapse>
  );
}
