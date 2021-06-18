import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import { AppDrawer } from './AppDrawer';

export const AppMenu = () => {
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen((prevState) => !prevState);
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
        >
          <MenuIcon />
        </IconButton>
        <AppDrawer
          open={isDrawerOpen}
          onOpen={toggleDrawer}
          onKeyDown={toggleDrawer}
          onClose={toggleDrawer}
        ></AppDrawer>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My Stream Controller
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
