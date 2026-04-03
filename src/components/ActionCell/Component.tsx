import { IconButton, Stack, Switch, Tooltip } from "@mui/material";
import { ActionCellProps } from "./";
import { EditIcon } from "../Icons";

const ActionCell: React.FC<ActionCellProps> = ({
  checked,
  tooltipToggle,
  onToggle,
  tooltipEdit,
  onEdit,
  switchSize = "medium",
  sxProps,
}) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1} height={"fit-content"} sx={{ ...sxProps }}>
      <Tooltip title={tooltipEdit} arrow>
        <IconButton
          type="button"
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
      </Tooltip>
      <Tooltip title={tooltipToggle} arrow>
        <Switch
          checked={checked}
          size={switchSize}
          onChange={(e) => onToggle(e.target.checked)}
        />
      </Tooltip>
    </Stack>
  );
};

export default ActionCell;