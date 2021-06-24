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

export const OutputSettings = () => {
  const classes = useStyles();
  const { device = {}, isStreaming } = React.useContext(AppContext);
  const { formats = [] } = device;

  const [defaultSettings, setdefaultSettings] = useLocalStorage(
    'outputSettings',
    {
      presetIdx: '',
      transcodeSettings: '',
      videoBitRate: '',
      videoFps: '',
      videoSize: '',
      audioBitRate: '',
      srtServerUrl: '',
      srtStatusUrl: ''
    }
  );

  const streamControl = React.useCallback(() => {
    if (!isStreaming) {
      const format = formats[defaultSettings.presetIdx];
      const params = {
        inputVideoSize: `${format.width}x${format.height}`,
        inputFrameRate: format.interval.denominator,
        outputTranscode: defaultSettings.transcodeSettings === 'custom',
        outputVideoBitRate: defaultSettings.videoBitRate,
        outputAudioBitRate: defaultSettings.audioBitRate,
        serverUrl: `srt://${defaultSettings.srtServerUrl}`,
        serverMonitorUrl: defaultSettings.srtStatusUrl
      };
      console.log('req params', params);
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
    } else {
      return axios
        .post('/stream/stop')
        .then(function (response) {
          // handle success
          // console.log(response);
          return response.data;
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    }
  }, [isStreaming, defaultSettings]);

  const { execute, status, value, error } = useAsync(streamControl, false);

  const renderMenuItems = () => {
    return formats.map((format, index) => {
      const label = `${format.width}x${format.height} - ${format.interval.denominator}fps (${format.formatName})`;
      return (
        <MenuItem key={label} value={index}>
          {label}
        </MenuItem>
      );
    });
  };

  const handleSelectChange = (event) => {
    setdefaultSettings((prevSettings) => ({
      ...prevSettings,
      presetIdx: event.target.value
    }));
  };

  const handleTrancodeSettingsChange = (event) => {
    setdefaultSettings((prevSettings) => ({
      ...prevSettings,
      transcodeSettings: event.target.value
    }));
  };

  const handleChange = (event) => {
    const newValue = event.target.value;
    setdefaultSettings((prevSettings) => ({
      ...prevSettings,
      [event.target.id]: newValue
    }));
  };

  return (
    <Container className={classes.myContainer} maxWidth={'sm'}>
      <form className={classes.form} noValidate autoComplete="off">
        <Typography className={classes.myTitle} component="h1" variant="h5">
          Input settings
        </Typography>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="preset-index-label">Video preset</InputLabel>
          <Select
            labelId="preset-index-label"
            id="presetIndex"
            label="Input settings"
            value={defaultSettings.presetIdx}
            onChange={handleSelectChange}
          >
            {renderMenuItems()}
          </Select>
        </FormControl>
        <Typography className={classes.myTitle} component="h1" variant="h5">
          Output settings
        </Typography>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="transcoding-settings-label">
            Transcoding preset
          </InputLabel>
          <Select
            labelId="transcoding-settings-label"
            id="transcodeSettings"
            label="Transcoding preset"
            value={defaultSettings.transcodeSettings}
            onChange={handleTrancodeSettingsChange}
          >
            <MenuItem value="copy">
              Copy input settings (No transcoding)
            </MenuItem>
            <MenuItem value="custom">Custom transcoding settings</MenuItem>
          </Select>
        </FormControl>
        {defaultSettings.transcodeSettings === 'custom' && (
          <>
            <TextField
              id="videoBitRate"
              label="Output video bitrate"
              color="secondary"
              value={defaultSettings.videoBitRate}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kbps</InputAdornment>
                )
              }}
              variant="outlined"
              fullWidth
            />
            <TextField
              id="audioBitRate"
              label="Output audio bitrate"
              color="secondary"
              value={defaultSettings.audioBitRate}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kbps</InputAdornment>
                )
              }}
              variant="outlined"
              fullWidth
            />
          </>
        )}
        <Typography className={classes.myTitle} component="h1" variant="h5">
          Output destination
        </Typography>
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
          variant="outlined"
          fullWidth
        />
        <TextField
          id="srtStatusUrl"
          label="SRT stats url"
          color="secondary"
          value={defaultSettings.srtStatusUrl}
          onChange={handleChange}
          variant="outlined"
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={execute}
          disabled={isStreaming}
          fullWidth
        >
          Start streaming
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={execute}
          disabled={!isStreaming}
          fullWidth
        >
          Stop streaming
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
