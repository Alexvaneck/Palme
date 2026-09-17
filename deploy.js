const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();

const config = {
  user: process.env.FTP_USER || "cnl0xaemr_u",
  password: process.env.FTP_PASSWORD || "RYC!bag6dzc0mvp2bfh",
  host: "ftp.cnl0xaemr.service.one",
  port: 21,
  localRoot: __dirname,
  remoteRoot: "/",
  include: [
    "*.html",
    "*.js",
    "*.css",
    "*.md",
    "assets/**"
  ],
  exclude: [
    "dist",
    "node_modules/**",
    ".git/**",
    ".gitignore",
    ".sftp-config.json",
    "package.json",
    "package-lock.json",
    "deploy.js"
  ],
  deleteRemote: false,
  forcePasv: true
};

console.log('🚀 Starting deployment to ftp.cnl0xaemr.service.one...');

ftpDeploy
  .deploy(config)
  .then(res => {
    console.log('✅ Deployment successful!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Deployment failed:', err);
    process.exit(1);
  });
