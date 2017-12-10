import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home } from "../Home";
import { TranslateAll } from "../TranslateAll";
import { Translate } from "../Translate";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact={true} component={Home} />
        <Route path="/translate" exact={true} component={Translate} />
        <Route path="/all" exact={true} component={TranslateAll} />
      </Switch>
    </Router>
  );
};

export default App;
