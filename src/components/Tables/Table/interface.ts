export interface BaseColumn<T> {
  label: string;
  align?: "left" | "right" | "center";
  render?: (row: T, index: number) => React.ReactNode; // permitir índice
}

export interface DataColumn<T, K extends keyof T> extends BaseColumn<T> {
  key: K;
}

export interface CustomColumn<T> extends BaseColumn<T> {
  key: string;
  render?: (row: T, index: number) => React.ReactNode;
}

export type IColumn<T> = DataColumn<T, keyof T> | CustomColumn<T>;

export interface TableProps<TRow> {
  columns: IColumn<TRow>[];
  rows: TRow[];
  rowsPerPageOptions?: number[];
  initialRowsPerPage?: number;
  isLoading?: boolean;
}

export interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}
