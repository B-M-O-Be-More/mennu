import { Stack, Typography, Button, Box, useTheme, Divider } from "@mui/material";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import { ReviewExtraRequestModalProps } from ".";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ReviewExtraRequestFormData, reviewExtraRequestSchema } from "@/schemas/extraRequestSchema";
import { AlertIcon, CircledCheckIcon } from "@/components/Icons";
import Card from "@/components/Cards/Card";
import ClosableAlertBox from "@/components/ClosableAlertBox/Component";

export default function ReviewExtraRequestModal({
  open,
  onClose,
  extraRequest,
  isApprove,
}: ReviewExtraRequestModalProps) {

  const theme = useTheme();

  const { register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewExtraRequestFormData>(
    {
      resolver:
        yupResolver(reviewExtraRequestSchema),
      defaultValues: { review: '' },
    });

  const onSubmit = (data: ReviewExtraRequestFormData) => {

    console.log(data);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isApprove ? "Aprovar Solicitação" : "Reprovar Solicitação"}
    >
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>

        <Card>
          <Box
            display="grid"
            gap={1}
            gridTemplateColumns="repeat(2, 1fr)"
          >
            <Box>
              <Typography variant="caption" color="text.secondary">Usuário</Typography>
              <Typography variant="body1">{extraRequest.usuario.nome}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Matrícula</Typography>
              <Typography variant="body1">{extraRequest.usuario.matricula}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Tipo</Typography>
              <Typography variant="body1">{extraRequest.tipo}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Data</Typography>
              <Typography variant="body1">{extraRequest.data}</Typography>
            </Box>
          </Box>

          <Divider sx={{ borderColor: "grey.100", my: 2 }} />

          <Typography variant="caption" color="text.secondary">Motivo</Typography>
          <Typography variant="body1">{extraRequest.motivo}</Typography>
        </Card>


        <Input
          label="Justificativa da Decisão"
          placeholder={isApprove ? "Descreva o motivo da aprovação..." : "Descreva o motivo da reprovação..."}
          optional={false}
          sx={{ flex: 1 }}
          register={register("review")}
          error={errors.review?.message}
          multiline
        />

        <ClosableAlertBox
          severity={isApprove ? "success" : "error"}
          icon={
            isApprove ? (
              <CircledCheckIcon color={theme.palette.success.contrastText} />
            ) : (
              <AlertIcon color={theme.palette.error.contrastText} />
            )
          }
          title={isApprove ? "Acesso aos Terminais" : "Acesso Negado aos Terminais"}
          description={
            isApprove
              ? "Ao aprovar, a solicitação será registrada e o usuário poderá utilizar o benefício."
              : "Ao reprovar, a solicitação será registrada e o usuário não poderá utilizar o benefício."
          }
        />

        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            sx={{
              flex: 1,
              fontSize: "1.2rem",
              border: "1px solid",
              borderColor: "divider",
              color: "text.secondary",
            }}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            sx={{
              flex: 1,
              fontSize: "1.2rem",
              backgroundColor: isApprove ? 'success.light' : 'error.contrastText',
              whiteSpace: "nowrap",
              "&:hover": {
                backgroundColor: isApprove ? 'success.contrastText' : 'error.dark',
              }
            }}
            variant="contained"
            type="submit"
          >
            {isApprove ? "Confirmar Aprovação" : "Confirmar Reprovação"}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
