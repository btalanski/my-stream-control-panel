import React from 'react';
import { CssBaseline } from '@material-ui/core';
import { AppMenu } from '../AppMenu';

export const App = () => {
  return (
    <React.Fragment>
      <CssBaseline>
        <AppMenu></AppMenu>
      </CssBaseline>
    </React.Fragment>
  );
};
