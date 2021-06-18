import * as React from 'react';
import {
  Box,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Link
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import TuneIcon from '@material-ui/icons/Tune';
import { Link as RouterLink } from 'react-router-dom';

const ListItemLink = (props) => {
  const { icon, primary, to, onClick } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} onClick={onClick} />
      )),
    [to]
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
};

export const AppDrawer = (props) => {
  const menuItems = [
    {
      label: 'Stream status',
      target: '/',
      icon: <TuneIcon></TuneIcon>
    },
    {
      label: 'Output settings',
      target: '/output-settings',
      icon: <TuneIcon></TuneIcon>
    }
  ];
  return (
    <SwipeableDrawer anchor="left" {...props}>
      <Box width={250}>
        <List>
          {menuItems.map((item) => (
            <ListItemLink
              key={item.label}
              to={item.target}
              primary={item.label}
              icon={item.icon}
              onClick={props.onOpen}
            />
          ))}
        </List>
      </Box>
    </SwipeableDrawer>
  );
};
