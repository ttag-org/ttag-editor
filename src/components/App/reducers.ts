import { PoData } from "src/lib/parser";
import { AppActions, AppActionsEnum } from "./actions";
import { Reducer } from "redux";

export type AppState = {
  poFile: PoData | null;
};

export const initialState: AppState = {
  poFile: null
};

export const reducer: Reducer<AppState> = (state = initialState, action: AppActions) => {
  switch (action.type) {
    case AppActionsEnum.LOAD_PO_FILE:
      return { ...state, poFile: action.file };
    default:
      return state;
  }
};
