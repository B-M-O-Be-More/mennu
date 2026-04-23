import { Dayjs } from 'dayjs';

export interface MenusTabProps {
  periodFilter?: { start: Dayjs | null; end: Dayjs | null } | null;
}