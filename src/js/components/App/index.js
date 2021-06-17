import React from 'react';
import {
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Typography
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';

export const App = () => {
  return (
    <React.Fragment>
      <CssBaseline>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              My Stream Controller
            </Typography>
          </Toolbar>
        </AppBar>
      </CssBaseline>
    </React.Fragment>
  );
};
