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
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
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

  return (
    <div style={{ flexShrink: 0, marginLeft: 16 }}>
      <IconButton onClick={handleFirstPage} disabled={page === 0}>
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBack} disabled={page === 0}>
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNext}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLast}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
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
  getRowKey,
}: TableProps<T>) {
  const [localPage, setLocalPage] = React.useState(0);
  const [localRowsPerPage, setLocalRowsPerPage] = React.useState(initialRowsPerPage);
  const isRemotePagination = Boolean(remotePagination);
  const page = remotePagination?.page ?? localPage;
  const rowsPerPage = remotePagination?.rowsPerPage ?? localRowsPerPage;
  const count = remotePagination?.count ?? rows.length;

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
            {columns.map((col) => (
              <TableCell key={String(col.key)} align={col.align || "left"}>
                {col.label}
              </TableCell>
            ))}
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
