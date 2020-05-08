import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import "antd/dist/antd.css";

import BasicLayout from "./layout/basic";
import Tags from "./pages/tags/index";
import TagCreate from "./pages/tags/create";

function App() {
  return (
    <div className="App">
      <Router>
        <BasicLayout>
          <Switch>
            <Route exact path={process.env.PUBLIC_URL + "/"} />
            <Route exact path={process.env.PUBLIC_URL + "/tags/create"} component={TagCreate} />
            <Route exact path={process.env.PUBLIC_URL + "/tags"} component={Tags} />
          </Switch>
        </BasicLayout>
      </Router>
    </div>
  );
}

export default App;
