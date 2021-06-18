import React from 'react';
import { CssBaseline, Backdrop, CircularProgress } from '@material-ui/core';
import { AppMenu } from '../AppMenu';
import { MemoryRouter } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import { OutputSettings } from '../../routes/OutputSettings';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}));

export const App = () => {
  const classes = useStyles();
  const isLoading = false;
  return (
    <React.Fragment>
      <CssBaseline>
        <MemoryRouter>
          <AppMenu />
          <Switch>
            <Route path="/output-settings">
              <OutputSettings />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </MemoryRouter>
        {isLoading && (
          <Backdrop open={isLoading} className={classes.backdrop}>
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
      </CssBaseline>
    </React.Fragment>
  );
};

export const Home = () => {
  return <div>Home!</div>;
};
