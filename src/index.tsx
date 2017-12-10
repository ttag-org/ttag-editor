import * as React from "react";
import * as ReactDOM from "react-dom";
import "./declarations";
import registerServiceWorker from "./registerServiceWorker";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { rootReducer } from "./store";
import App from "./components/App";
import { createLogger } from "redux-logger";

const logger = createLogger();

const store = createStore(rootReducer, applyMiddleware(logger));

export const MainApp = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

ReactDOM.render(<MainApp />, document.getElementById("root") as HTMLElement);
registerServiceWorker();
