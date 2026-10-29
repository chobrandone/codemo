// PM2 process file for the non-Docker VPS deployment.
//   pm2 start ecosystem.config.js && pm2 save && pm2 startup
// Runs the Next.js standalone server; variables are read from .env (Node 20.6+).
module.exports = {
  apps: [
    {
      name: "codemo",
      cwd: __dirname,
      script: ".next/standalone/server.js",
      node_args: "--env-file=.env",
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "600M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",
      },
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      time: true,
    },
  ],
};
