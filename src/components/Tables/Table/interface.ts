export interface IColumn<T> {
  key: keyof T | string;
  label: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => React.ReactNode;
}

export interface TableProps<T> {
  columns: IColumn<T>[];
  rows: T[];
  rowsPerPageOptions?: number[];
  initialRowsPerPage?: number;
}

export interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}
