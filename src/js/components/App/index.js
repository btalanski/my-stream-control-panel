import React from 'react';
import { CssBaseline, Backdrop, CircularProgress } from '@material-ui/core';
import { AppMenu } from '../AppMenu';
import { MemoryRouter } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import { OutputSettings } from '../../routes/OutputSettings';
import { makeStyles } from '@material-ui/core/styles';
import { useAsync } from '../../hooks/useAsync';
import { AppContext } from '../../context/appContext';
import * as axios from 'axios';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}));

const getDeviceDetails = () => {
  return axios
    .get('/devices')
    .then(function (response) {
      // handle success
      // console.log(response);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};

export const App = () => {
  const [state, setState] = React.useState({ device: null });
  const { execute, status, value, error } = useAsync(getDeviceDetails, false);
  const classes = useStyles();

  React.useEffect(() => execute(), []);

  React.useEffect(() => {
    console.log(value, error);
    if (!error) {
      setState((prevState) => ({
        ...prevState,
        device: value
      }));
    }
  }, [value, error]);

  return (
    <React.Fragment>
      <CssBaseline>
        <AppContext.Provider value={state}>
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
          {status === 'pending' && (
            <Backdrop open={true} className={classes.backdrop}>
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
        </AppContext.Provider>
      </CssBaseline>
    </React.Fragment>
  );
};

export const Home = () => {
  return <div>Home!</div>;
};
