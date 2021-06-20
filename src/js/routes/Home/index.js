import React from 'react';
import { Container, Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from '../../context/appContext';

const useStyles = makeStyles((theme) => ({
  myTitle: {
    margin: 0
  },
  myContainer: {
    margin: theme.spacing(6, 'auto')
  },
  form: {
    '& > *': {
      margin: theme.spacing(1, 'auto')
    }
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}));

export const Home = () => {
  const classes = useStyles();
  const { isStreaming, streamHealthLog, streamStatus } =
    React.useContext(AppContext);

  return (
    <Container className={classes.myContainer} maxWidth={'sm'}>
      <Card variant="outlined">
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Encoder status
          </Typography>
          <pre>
            {JSON.stringify(
              { isStreaming, streamHealthLog, streamStatus },
              null,
              2
            )}
          </pre>
        </CardContent>
      </Card>
    </Container>
  );
};
