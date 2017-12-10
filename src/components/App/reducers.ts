import { PoData } from "src/lib/parser";
import { AppActions, AppActionsEnum } from "./actions";
import { Reducer } from "redux";

export type AppState = {
  poFile: PoData | null;
};

export const initialState: AppState = {
  poFile: null
};

function updateTranslation(
  state: AppState,
  msgid: string,
  idx: number,
  value: string
) {
  // Mutable state, hoozah!
  if (state.poFile) {
    state.poFile.translations[""][msgid].msgstr[idx] = value;
  }
}

export const reducer: Reducer<AppState> = (
  state = initialState,
  action: AppActions
) => {
  switch (action.type) {
    case AppActionsEnum.LOAD_PO_FILE:
      return { ...state, poFile: action.payload.file };
    case AppActionsEnum.UPDATE_TRANSLATION:
      updateTranslation(
        state,
        action.payload.msgid,
        action.payload.idx,
        action.payload.value
      );
      return state;
    default:
      return state;
  }
};
