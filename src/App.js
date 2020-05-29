import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import 'antd/dist/antd.css';

import BasicLayout from './layout/basic';
import Login from './pages/login';
import Registration from './pages/registration';
import routes from './routes';

function App() {
  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route path="/auth/login" component={Login} />
          <Route path="/auth/registration" component={Registration} />
          <BasicLayout>
            <Switch>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  exact={route.exact}
                  path={route.path}
                  component={route.component}
                />
              ))}
            </Switch>
          </BasicLayout>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
