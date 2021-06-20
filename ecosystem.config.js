module.exports = {
  apps: [
    {
      name: 'mscp',
      script: './bin/www',
      node_args: '-r dotenv/config',
      args: 'dotenv_config_path=.env'
    }
  ]
};
