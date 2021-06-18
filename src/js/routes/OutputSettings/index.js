import React from 'react';
import {
  TextField,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  InputAdornment,
  Typography,
  Backdrop,
  CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAsync } from '../../hooks/useAsync';
import { AppContext } from '../../context/appContext';
import * as axios from 'axios';

const useStyles = makeStyles((theme) => ({
  myTitle: {
    margin: theme.spacing(0, 0, 2, 0)
  },
  myContainer: {
    margin: theme.spacing(3, 'auto')
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

const startStream = (params) => {
  return axios
    .post('/stream/start', params)
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

export const OutputSettings = () => {
  const classes = useStyles();
  const { execute, status, value, error } = useAsync(startStream, false);
  const { device = {} } = React.useContext(AppContext);
  const { formats = [] } = device;

  const [defaultSettings, setdefaultSettings] = useLocalStorage(
    'outputSettings',
    {
      presetValue: '',
      videoBitRate: '1024',
      audioBitRate: '128',
      srtServerUrl: 'srt://',
      srtStatusUrl: 'http://'
    }
  );

  const renderMenuItems = () => {
    return formats.map((format, index) => {
      const label = `${format.width}x${format.height} - ${format.interval.denominator}fps (${format.formatName})`;
      const value = `${format.width}x${format.height}`;
      return (
        <MenuItem key={label} value={value}>
          {label}
        </MenuItem>
      );
    });
  };

  const handleSelectChange = (event) => {
    setdefaultSettings((prevSettings) => ({
      ...prevSettings,
      presetValue: event.target.value
    }));
  };

  const handleChange = (event) => {
    const newValue = event.target.value;
    setdefaultSettings((prevSettings) => ({
      ...prevSettings,
      [event.target.id]: newValue
    }));
  };

  const handleClick = () => {
    const params = {
      inputVideoSize: defaultSettings.presetValue,
      inputFrameRate: 30,
      outputVideoBitRate: defaultSettings.videoBitRate,
      outputAudioBitRate: defaultSettings.audioBitRate,
      serverUrl: `srt://${defaultSettings.srtServerUrl}`
    };
    execute(params);
  };

  return (
    <Container className={classes.myContainer} maxWidth="xl">
      <Typography className={classes.myTitle} component="h1" variant="h5">
        Output settings
      </Typography>
      <form className={classes.form} noValidate autoComplete="off">
        <FormControl fullWidth>
          <InputLabel id="presetIndexLabel">Streaming preset</InputLabel>
          <Select
            labelId="presetIndexLabel"
            id="presetIndex"
            value={defaultSettings.presetIndex}
            onChange={handleSelectChange}
          >
            {renderMenuItems()}
          </Select>
        </FormControl>
        <TextField
          id="videoBitRate"
          label="Output video bitrate"
          color="secondary"
          value={defaultSettings.videoBitRate}
          onChange={handleChange}
          InputProps={{
            endAdornment: <InputAdornment position="end">kbps</InputAdornment>
          }}
          fullWidth
        />
        <TextField
          id="audioBitRate"
          label="Output audio bitrate"
          color="secondary"
          value={defaultSettings.audioBitRate}
          onChange={handleChange}
          InputProps={{
            endAdornment: <InputAdornment position="end">kbps</InputAdornment>
          }}
          fullWidth
        />
        <TextField
          id="srtServerUrl"
          label="SRT server url"
          color="secondary"
          value={defaultSettings.srtServerUrl}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">srt://</InputAdornment>
            )
          }}
          fullWidth
        />
        <TextField
          id="srtStatusUrl"
          label="SRT stats url"
          color="secondary"
          value={defaultSettings.srtStatusUrl}
          onChange={handleChange}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          fullWidth
        >
          Start streaming
        </Button>
      </form>
      {status === 'pending' && (
        <Backdrop open={true} className={classes.backdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Container>
  );
};
