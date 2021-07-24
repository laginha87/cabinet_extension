import ReactDOM from 'react-dom';
import {Wrapper} from './Wrapper';
import {Provider} from 'react-redux';
import {store} from '../store';
import {Search} from './Search';
import {HashRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import {Inbox} from "./Inbox";
import {Navbar} from "./Navbar";
import {ContextMenuProvider} from "./ContextMenuProvider";


ReactDOM.render(<Provider store={store}>
  <ContextMenuProvider>
    <Router>
      <Search/>
      <Navbar/>
      <Switch>
        <Route path={"/inbox"}>
          <Inbox/>
        </Route>
        <Route path={"/cabinet/"}>
          <Wrapper/>
        </Route>
        <Route path={"/"}>
          <Redirect to={"/cabinet/"} />
        </Route>
      </Switch>
    </Router>
  </ContextMenuProvider>
  </Provider>,
  document.getElementById('root')
);
