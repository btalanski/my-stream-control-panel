# my-stream-control-panel

## Requirements

- FFMpeg installed and available on your PATH
- v4l-utils installed
- PM2 installed globally

## Setting up the app to start on boot with PM2

First install PM2 globally with

```
npm install -g pm2
```

To generate the startup script, simply run the following command as root and follow the instructions:

```
pm2 startup
```

Next `cd` to the directory where the repo was clonned to and install the required modules:

```
npm install --only=prod
```

Follow the steps below to install v4l2camera:

```
cd node_modules
git clone git@github.com:sebakerckhof/node-v4l2camera.git v4l2camera
cd v4l2camera
git checkout fix/node12
npm install
cd ../..
```

Finally start the application using PM2:

```
export NODE_ENV=production && pm2 start ./bin/www
```

Next, you need to save the current list of processes to manage using PM2 so that they will re-spawn at system boot

```
pm2 save
```

Reboot your system and check if all your Node.js processes are running under PM2 with:

```
pm2 ls
# or
pm2 status
```

Manually resurrect processes by running the following command:

```
pm2 resurrect
```

Disable the startup system by running the unstartup sub-command:

```
pm2 unstartup
# or
pm2 startup systemd
```

To update the startup script, first, disable it, then start it again with:

```
pm2 unstartup
pm2 startup
```

PM2 documetation: https://pm2.keymetrics.io/docs/usage/startup/#startup-script-generator
