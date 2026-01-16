import { IconButton, Switch } from "@mui/material";
import { ActionCellProps } from "./";
import { EditIcon } from "../Icons";

const ActionCell: React.FC<ActionCellProps> = ({
  checked,
  onToggle,
  onEdit,
  switchSize = "medium",
}) => {
  return (
    <>
      <IconButton
        aria-label="edit"
        size="small"
        onClick={onEdit}
        sx={{
          marginRight: 1,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <EditIcon width={20} />
      </IconButton>

      <Switch
        checked={checked}
        size={switchSize}
        onChange={(e) => onToggle(e.target.checked)}
      />
    </>
  );
};

export default ActionCell;