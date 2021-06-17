import * as React from 'react';
import {
  Box,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import TuneIcon from '@material-ui/icons/Tune';

export const AppDrawer = (props) => {
  const menuItems = [
    {
      label: 'Stream status',
      target: '#',
      icon: <TuneIcon></TuneIcon>
    },
    {
      label: 'Output settings',
      target: '#',
      icon: <TuneIcon></TuneIcon>
    }
  ];
  return (
    <SwipeableDrawer anchor="left" {...props}>
      <Box width={250}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.label}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label}></ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>
    </SwipeableDrawer>
  );
};
