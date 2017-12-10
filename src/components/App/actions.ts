import { PoData } from "src/lib/parser";

export enum AppActionsEnum {
  LOAD_PO_FILE = "LOAD_PO_FILE",
  UPDATE_TRANSLATION = "UPDATE_TRANSLATION"
}

export interface AddPoFileAction {
  readonly type: AppActionsEnum.LOAD_PO_FILE;
  readonly payload: { file: PoData };
}

export interface UpdateTranslation {
  readonly type: AppActionsEnum.UPDATE_TRANSLATION;
  readonly payload: {
    msgid: string;
    idx: number;
    value: string;
  };
}

export const actionCreators = {
  addPoFile: (file: PoData): AddPoFileAction => ({
    type: AppActionsEnum.LOAD_PO_FILE,
    payload: { file }
  }),
  updateTranslation: (
    msgid: string,
    idx: number,
    value: string
  ): UpdateTranslation => ({
    type: AppActionsEnum.UPDATE_TRANSLATION,
    payload: { msgid, idx, value }
  })
};

export type AppActions = AddPoFileAction | UpdateTranslation;
