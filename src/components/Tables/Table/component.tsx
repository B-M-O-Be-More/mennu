import * as React from "react";
import {
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  TableHead,
  IconButton,
  Box,
  Button,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { TablePaginationActionsProps, TableProps } from "./";
import TableSkeleton from "@/components/Skeletons/TableSkeleton";

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPage = (event: React.MouseEvent<HTMLButtonElement>) =>
    onPageChange(event, 0);
  const handleBack = (event: React.MouseEvent<HTMLButtonElement>) =>
    onPageChange(event, page - 1);
  const handleNext = (event: React.MouseEvent<HTMLButtonElement>) =>
    onPageChange(event, page + 1);
  const handleLast = (event: React.MouseEvent<HTMLButtonElement>) =>
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

  const lastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);
  const isFirstPage = page <= 0;
  const isLastPage = count === 0 || page >= lastPage;

  const buttonSx = (disabled: boolean) => ({
    minWidth: 44,
    minHeight: 44,
    color: disabled ? "grey.300" : "text.secondary",
    cursor: disabled ? "default" : "pointer",
    transition: "background-color 180ms ease, color 180ms ease, transform 180ms ease",
    "&:hover": {
      bgcolor: disabled ? "transparent" : "primary.light",
      color: disabled ? "grey.300" : "text.primary",
    },
    "&:active": {
      transform: disabled ? "none" : "scale(0.94)",
    },
    "&.Mui-focusVisible": {
      outline: "2px solid",
      outlineColor: "primary.main",
      outlineOffset: 2,
    },
    "&.Mui-disabled": {
      color: "grey.300",
    },
  });

  const renderButton = (
    label: string,
    disabled: boolean,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
    icon: React.ReactNode,
  ) => (
    <Tooltip title={label} enterDelay={350}>
      <span>
        <IconButton
          aria-label={label}
          onClick={onClick}
          disabled={disabled}
          sx={buttonSx(disabled)}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );

  return (
    <div style={{ flexShrink: 0, marginLeft: 16 }}>
      {renderButton(
        "Primeira página",
        isFirstPage,
        handleFirstPage,
        theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />,
      )}
      {renderButton(
        "Página anterior",
        isFirstPage,
        handleBack,
        theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />,
      )}
      {renderButton(
        "Próxima página",
        isLastPage,
        handleNext,
        theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />,
      )}
      {renderButton(
        "Última página",
        isLastPage,
        handleLast,
        theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />,
      )}
    </div>
  );
}

export default function TableG<T extends object>({
  columns,
  rows,
  rowsPerPageOptions = [5, 10, 25, 50],
  initialRowsPerPage = 5,
  isLoading = false,
  remotePagination,
  pageResetKey,
  columnFilters,
  getRowKey,
}: TableProps<T>) {
  const [localPage, setLocalPage] = React.useState(0);
  const [localRowsPerPage, setLocalRowsPerPage] = React.useState(initialRowsPerPage);
  const [filterAnchor, setFilterAnchor] = React.useState<{
    key: string;
    element: HTMLElement;
  } | null>(null);
  const isRemotePagination = Boolean(remotePagination);
  const page = remotePagination?.page ?? localPage;
  const rowsPerPage = remotePagination?.rowsPerPage ?? localRowsPerPage;
  const count = remotePagination?.count ?? rows.length;

  React.useEffect(() => {
    if (!isRemotePagination) setLocalPage(0);
  }, [isRemotePagination, pageResetKey]);

  const emptyRows =
    !isRemotePagination && page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - rows.length)
      : 0;

  const handleChangePage = (_: unknown, newPage: number) => {
    if (remotePagination) {
      remotePagination.onPageChange(newPage);
      return;
    }

    setLocalPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);

    if (remotePagination) {
      remotePagination.onRowsPerPageChange(newRowsPerPage);
      return;
    }

    setLocalRowsPerPage(newRowsPerPage);
    setLocalPage(0);
  };

  const startIndex = page * rowsPerPage;

  const displayedRows = isRemotePagination
    ? rows
    : rowsPerPage > 0
      ? rows.slice(startIndex, startIndex + rowsPerPage)
      : rows;

  return isLoading ? (
    <TableSkeleton columns={columns.length} />
  ) : (
    <TableContainer
      sx={{
        maxWidth: "100%",
        overflowX: "auto",
      }}>
      <Table>
        <TableHead
          sx={{
            "& .MuiTableCell-root": {
              color: "tables.text",
              borderBottom: "1px solid",
              borderColor: "divider",
            },
          }}>
          <TableRow>
            {columns.map((col) => {
              const columnKey = String(col.key);
              const filter = columnFilters?.[columnKey];
              const isOpen = filterAnchor?.key === columnKey;
              const isToggle = Boolean(filter?.onToggle);

              return (
                <TableCell key={columnKey} align={col.align || "left"}>
                  <Stack direction="row" alignItems="center" gap={0.5}>
                    <Typography component="span" variant="inherit" sx={{ flex: 1 }}>
                      {col.label}
                    </Typography>
                    {filter && (
                      <Tooltip
                        title={
                          isToggle
                            ? filter.active
                              ? "Alternar ordenação"
                              : "Ordenar quantidade"
                            : filter.active
                              ? "Editar filtro"
                              : "Filtrar coluna"
                        }
                        enterDelay={350}
                      >
                        <IconButton
                          aria-label={filter.ariaLabel}
                          aria-expanded={isToggle ? undefined : isOpen}
                          aria-haspopup={isToggle ? undefined : "dialog"}
                          aria-pressed={isToggle ? filter?.active : undefined}
                          onClick={(event) => {
                            if (filter?.onToggle) {
                              filter.onToggle();
                              return;
                            }
                            setFilterAnchor((previous) =>
                              previous?.key === columnKey
                                ? null
                                : { key: columnKey, element: event.currentTarget },
                            );
                          }}
                          size="small"
                          sx={{
                            minWidth: 32,
                            minHeight: 32,
                            color: filter.active ? "primary.main" : "text.secondary",
                            bgcolor: filter.active ? "primary.light" : "transparent",
                            cursor: "pointer",
                            transition: "background-color 180ms ease, color 180ms ease",
                            "&:hover": {
                              bgcolor: "primary.light",
                              color: "primary.main",
                            },
                            "&.Mui-focusVisible": {
                              outline: "2px solid",
                              outlineColor: "primary.main",
                              outlineOffset: 1,
                            },
                          }}
                        >
                          <KeyboardArrowDownIcon
                            fontSize="small"
                            sx={{
                              transform: isOpen ? "rotate(180deg)" : "none",
                              ...(filter?.sortDirection === "asc" && {
                                transform: "rotate(180deg)",
                              }),
                              transition: "transform 180ms ease",
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                  {filter && filter.content && !isToggle && (
                    <Popover
                      open={isOpen}
                      anchorEl={filterAnchor?.element}
                      onClose={() => setFilterAnchor(null)}
                      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                      transformOrigin={{ vertical: "top", horizontal: "left" }}
                      slotProps={{
                        paper: {
                          sx: {
                            mt: 0.5,
                            p: 2,
                            width: { xs: 280, sm: 320 },
                            maxWidth: "calc(100vw - 32px)",
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: "divider",
                            boxShadow: "0 8px 24px rgba(16, 24, 40, 0.12)",
                          },
                        },
                      }}
                    >
                      <Box role="dialog" aria-label={filter.ariaLabel}>
                        {filter.content}
                        {filter.onClear && (
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => {
                              filter.onClear?.();
                              setFilterAnchor(null);
                            }}
                            sx={{ mt: 1, px: 0, minHeight: 36 }}
                          >
                            Limpar filtro
                          </Button>
                        )}
                      </Box>
                    </Popover>
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>

        <TableBody>
          {
            displayedRows.map((row, idx) => {
              const absoluteIndex = startIndex + idx;

              return (
                <TableRow
                  key={getRowKey?.(row, absoluteIndex) ?? absoluteIndex}
                  sx={{
                    "& .MuiTableCell-root": {
                      color: "tables.text",
                      borderBottom: "1px solid",
                      borderColor: "grey.100",
                    },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell key={String(col.key)} align={col.align || "left"}>
                      {col.render
                        ? col.render(row, absoluteIndex)
                        : (row[col.key as keyof T] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          }

          {rows.length === 0 && (
            <TableRow
              sx={{ "& .MuiTableCell-root": { color: "text.secondary" } }}>
              <TableCell colSpan={columns.length} align="center">
                Nenhum registro encontrado
              </TableCell>
            </TableRow>
          )}

          {emptyRows > 0 && (
            <TableRow
              style={{ height: 53 * emptyRows }}
              sx={{ "& .MuiTableCell-root": { color: "tables.text" } }}>
              <TableCell colSpan={columns.length} />
            </TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow sx={{ "& .MuiTableCell-root": { color: "tables.text" } }}>
            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              colSpan={columns.length}
              count={count}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
              labelRowsPerPage="Linhas por página"
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
