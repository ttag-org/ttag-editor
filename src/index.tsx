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

console.log(config);

const source =  config.source || "upload";

if (source === "upload") {
  mountApp({app: {
    poFile: null,
    source: source,    
  }});
} else if (source === "local") {
  fetch("/open").then((response) => response.text()).then((text: string) => {
    mountApp({
        app: {
          poFile: parse(text),
          source: source,    
        }
     });
  });
}

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
