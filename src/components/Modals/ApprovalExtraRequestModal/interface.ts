import { IExtraRequest } from "@/data/tableColumns";

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ReviewExtraRequestModalProps {
  open: boolean;
  onClose: () => void;
  extraRequest: IExtraRequest;
  isApprove: boolean;
}
