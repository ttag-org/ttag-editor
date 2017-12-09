import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home } from "../Home";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact={true} component={Home} />
      </Switch>
    </Router>
  );
};

export default App;
