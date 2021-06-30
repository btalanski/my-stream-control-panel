import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import MenuIcon from '@material-ui/icons/Menu';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import { AppDrawer } from './AppDrawer';
import { AppContext } from '../../context/appContext';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1
  }
}));

export const AppMenu = () => {
  const classes = useStyles();
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const { isStreaming } = React.useContext(AppContext);
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
        <Typography variant="h6" component="div">
          My Stream Controller
        </Typography>
        <div className={classes.grow}></div>
        <Box component="div">
          {isStreaming ? (
            <VideocamIcon style={{ color: red[500] }} />
          ) : (
            <VideocamOffIcon />
          )}
          <Typography variant="srOnly">
            Live: {isStreaming ? 'Yes' : 'No'}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
