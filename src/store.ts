import { combineReducers } from "redux";
import { reducer as appReducer, AppState } from "./components/App/reducers";

export interface RootState {
  app: AppState;
}

export const rootReducer = combineReducers<RootState>({
  app: appReducer
});
