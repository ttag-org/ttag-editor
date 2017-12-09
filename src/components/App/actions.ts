import { PoData } from "src/lib/parser";

export enum AppActionsEnum {
  LOAD_PO_FILE = "LOAD_PO_FILE"
}

export interface AddPoFileAction {
  readonly type: AppActionsEnum.LOAD_PO_FILE;
  readonly file: PoData;
}

export const actionCreators = {
    addPoFile: (file: PoData): AddPoFileAction => ({
        file, type: AppActionsEnum.LOAD_PO_FILE
    })
};

export type AppActions = AddPoFileAction;
