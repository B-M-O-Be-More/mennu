import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Skeleton,
} from "@mui/material";
import { TableSkeletonProps } from "./interface";

export function TableSkeleton({ columns = 7, rows = 3 }: TableSkeletonProps) {
  const footerColumns = 2;
  return (
    <TableContainer sx={{ maxWidth: "100%", overflowX: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableCell key={index}>
                <Skeleton variant="text" width="60%" />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton variant="text" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns - footerColumns} />
            <TableCell colSpan={footerColumns}>
              <Skeleton variant="rectangular" height={20} />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
