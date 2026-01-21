import { Box, Button, Stack, Typography } from "@mui/material";
import { TerminalsTabProps } from "./interface";
import { PlusIcon } from "@/components/Icons";
import React from "react";

export default function TerminalsTab({ }: TerminalsTabProps) {
  const [openNewTerminalModal, setOpenNewTerminalModal] = React.useState(false);

  return (
    <>
      <Stack justifyContent={'space-between'} direction={'row'} alignItems={'center'} >
        <Box>
          <Typography variant="h6" fontWeight={'400'}>Terminais Cadastrados</Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            fontWeight={'400'}
          >
            Gerencie os terminais de acesso às refeições
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          sx={{
            fontWeight: '400',
            paddingY: 1.5
          }}
          onClick={() => setOpenNewTerminalModal(true)}
        >
          Novo Terminal
        </Button>
      </Stack>
    </>
  );
}