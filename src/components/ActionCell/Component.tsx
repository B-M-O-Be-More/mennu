import { IconButton, Stack, Switch } from "@mui/material";
import { ActionCellProps } from "./";
import { EditIcon } from "../Icons";

const ActionCell: React.FC<ActionCellProps> = ({
  checked,
  onToggle,
  onEdit,
  switchSize = "medium",
  sxProps,
}) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1} height={"fit-content"} sx={{ ...sxProps }}>
      <IconButton
        aria-label="edit"
        size="small"
        onClick={onEdit}
        sx={{
          marginRight: 1,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          height: "fit-content",
          color: "default.contrastText",
        }}
      >
        <EditIcon width={20} />
      </IconButton>

      <Switch
        checked={checked}
        size={switchSize}
        onChange={(e) => onToggle(e.target.checked)}
      />
    </Stack>
  );
};

export default ActionCell;