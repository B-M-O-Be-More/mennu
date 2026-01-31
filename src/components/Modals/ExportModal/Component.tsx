
import { Stack, Box, Typography, Button } from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import { ExportModalProps } from "./interface";
import Modal from "../Modal";
import React from "react";
import IconBox from "@/components/Cards/IconBox";

export default function ExportModal({
  open,
  onClose,
  title,
  subtitle,
  options,
  onPreview,
  onDownload,
}: ExportModalProps & {
  onPreview?: (option: typeof options[number]) => void;
  onDownload?: (option: typeof options[number]) => void;
}) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  return (
    <Modal open={open} onClose={onClose} title={title} subtitle={subtitle}>
      <Stack gap={2}>
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;
          return (
            <Stack
              key={index}
              direction="row"
              gap={2}
              border="3px solid"
              borderColor={isSelected ? option.bgColor : "divider"}
              borderRadius={3}
              padding={2}
              sx={{
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: 2,
                  transform: "translateY(-2px)",
                },
              }}
              onClick={() => setSelectedIndex(index)}
            >
              <IconBox
                icon={option.icon}
                bgColor={option.bgColor}
                padding={1.5}
              />
              <Box component="span">
                <Typography variant="body1" color="text.primary">
                  {option.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.description}
                </Typography>
              </Box>
            </Stack>
          );
        })}

        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            sx={{
              flex: 1,
              fontSize: "1.2rem",
              paddingY: 1,
              fontWeight: 400,
              color: "text.secondary",
              borderRadius: 2
            }}
            disabled={selectedIndex === null}
            onClick={() => selectedIndex !== null && onPreview?.(options[selectedIndex])}
          >
            Visualizar
          </Button>
          <Button
            sx={{
              flex: 1,
              fontSize: "1.2rem",
              paddingY: 1,
              fontWeight: 400,
              borderRadius: 2
            }}
            variant="contained"
            startIcon={<DownloadIcon />}
            disabled={selectedIndex === null}
            onClick={() => selectedIndex !== null && onDownload?.(options[selectedIndex])}
          >
            Baixar
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
