import React from 'react';
import { Container, Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from '../../context/appContext';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

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
          <Typography variant="h5" gutterBottom>
            Encoder status
          </Typography>
          {isStreaming && (
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box fontWeight="fontWeightBold">Frames per second:</Box>
              </Grid>
              <Grid item xs={6}>
                {streamHealthLog?.fps}
              </Grid>

              <Grid item xs={6}>
                <Box fontWeight="fontWeightBold">Bitrate:</Box>
              </Grid>
              <Grid item xs={6}>
                {streamHealthLog?.bitrate}
              </Grid>

              <Grid item xs={6}>
                <Box fontWeight="fontWeightBold">Transcoding speed:</Box>
              </Grid>
              <Grid item xs={6}>
                {streamHealthLog?.speed}
              </Grid>

              <Grid item xs={6}>
                <Box fontWeight="fontWeightBold">Transcoded frames:</Box>
              </Grid>
              <Grid item xs={6}>
                {streamHealthLog?.frame}
              </Grid>

              <Grid item xs={6}>
                <Box fontWeight="fontWeightBold">Transcoder uptime:</Box>
              </Grid>
              <Grid item xs={6}>
                {streamHealthLog?.time}
              </Grid>
            </Grid>
          )}
          {!isStreaming && (
            <Typography component="p" gutterBottom>
              Not streaming
            </Typography>
          )}
          {/* <pre>{JSON.stringify({ streamStatus }, null, 2)}</pre> */}
        </CardContent>
      </Card>
      <Box mt="1rem">
        <Card variant="outlined" mt="1rem" raised>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Stream status
            </Typography>
            {isStreaming && (
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Box fontWeight="fontWeightBold">Receive rate:</Box>
                </Grid>
                <Grid item xs={6}>
                  {streamStatus?.mbpsRecvRate} mbits/s
                </Grid>

                <Grid item xs={6}>
                  <Box fontWeight="fontWeightBold">Receive buffer:</Box>
                </Grid>
                <Grid item xs={6}>
                  {streamStatus?.msRcvBuf}
                </Grid>

                <Grid item xs={6}>
                  <Box fontWeight="fontWeightBold">Bytes received drop:</Box>
                </Grid>
                <Grid item xs={6}>
                  {streamStatus?.bytesRcvDrop}
                </Grid>

                <Grid item xs={6}>
                  <Box fontWeight="fontWeightBold">Bytes received loss:</Box>
                </Grid>
                <Grid item xs={6}>
                  {streamStatus?.bytesRcvLoss}
                </Grid>

                <Grid item xs={6}>
                  <Box fontWeight="fontWeightBold">Bandwidth:</Box>
                </Grid>
                <Grid item xs={6}>
                  {streamStatus?.mbpsBandwidth} mbits/s
                </Grid>

                <Grid item xs={6}>
                  <Box fontWeight="fontWeightBold">Bitrate:</Box>
                </Grid>
                <Grid item xs={6}>
                  {streamStatus?.bitrate} kbits/s
                </Grid>

                <Grid item xs={6}>
                  <Box fontWeight="fontWeightBold">Packet drop:</Box>
                </Grid>
                <Grid item xs={6}>
                  {streamStatus?.pktRcvDrop}
                </Grid>

                <Grid item xs={6}>
                  <Box fontWeight="fontWeightBold">Packet loss:</Box>
                </Grid>
                <Grid item xs={6}>
                  {streamStatus?.pktRcvLoss}
                </Grid>

                <Grid item xs={6}>
                  <Box fontWeight="fontWeightBold">RTT:</Box>
                </Grid>
                <Grid item xs={6}>
                  {streamStatus?.rtt} seconds
                </Grid>

                <Grid item xs={6}>
                  <Box fontWeight="fontWeightBold">Uptime:</Box>
                </Grid>
                <Grid item xs={6}>
                  {streamStatus?.uptime} seconds
                </Grid>
              </Grid>
            )}
            {!isStreaming && (
              <Typography component="p" gutterBottom>
                Not streaming
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
