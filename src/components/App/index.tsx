import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home } from "../Home";
import { MessageList } from "../MessageList";
import { Translate } from "../Translate";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact={true} component={Home} />
        <Route path="/translate" exact={true} component={Translate} />
        <Route path="/all" exact={true} component={MessageList} />
      </Switch>
    </Router>
  );
};

export default App;
