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
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useLocalStorage } from '../../hooks/useLocalStorage';

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
  }
}));

export const OutputSettings = () => {
  const classes = useStyles();
  const [defaultSettings, setdefaultSettings] = useLocalStorage(
    'outputSettings',
    {
      presetIndex: 0,
      videoBitRate: '1024',
      audioBitRate: '128',
      srtServerUrl: 'srt://',
      srtStatusUrl: 'http://'
    }
  );

  const handleSelectChange = (event) => {
    setdefaultSettings((prevSettings) => ({
      ...prevSettings,
      presetIndex: event.target.value
    }));
  };
  const handleChange = (event) => {
    const newValue = event.target.value;
    setdefaultSettings((prevSettings) => ({
      ...prevSettings,
      [event.target.id]: newValue
    }));
  };

  const handleClick = () => true;

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
            <MenuItem value={0}>480p - 30fps</MenuItem>
            <MenuItem value={1}>720p - 30fps</MenuItem>
            <MenuItem value={2}>1080p - 30fps</MenuItem>
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
    </Container>
  );
};
