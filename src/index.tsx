import * as React from "react";
import * as ReactDOM from "react-dom";
import "./declarations";
import registerServiceWorker from "./registerServiceWorker";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { rootReducer, RootState } from "./store";
import App from "./components/App";
import { createLogger } from "redux-logger";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { parse } from "src/lib/parser";

const logger = createLogger();

const config = window["C3POEDITOR"] || {};

const load = config.load || new Promise((resolve) => resolve())
const save = config.save || (() => null)
const source = config.source || 'upload'

load.then((text: string) => {
  const poFile = text ? parse(text): null;
  mountApp({app: {poFile, save, source}});
})

function mountApp(initialState: RootState) {

  const store = createStore(rootReducer, initialState, applyMiddleware(logger));

  const MainApp = () => {
    return (
      <Provider store={store}>
        <MuiThemeProvider>
          <App />
        </MuiThemeProvider>
      </Provider>
    );
  };

  ReactDOM.render(<MainApp />, document.getElementById("root") as HTMLElement);
  registerServiceWorker();
}
