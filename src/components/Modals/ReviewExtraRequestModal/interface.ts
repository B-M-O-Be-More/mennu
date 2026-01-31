import { IExtraRequest } from "@/Interfaces/ExtraRequest/extraRequestColumns";

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ReviewExtraRequestModalProps {
  open: boolean;
  onClose: () => void;
  extraRequest: IExtraRequest;
  isApprove: boolean;
}
