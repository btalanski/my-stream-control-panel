import * as React from 'react';
import {
  Box,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';

export const AppDrawer = (props) => {
  return (
    <SwipeableDrawer anchor="left" {...props}>
      <Box width={250}>
        <List>
          <ListItem>
            <ListItemText primary={'Teste'}></ListItemText>
          </ListItem>
        </List>
      </Box>
    </SwipeableDrawer>
  );
};
