const Client = require('ftp');
const fs = require('fs');
const path = require('path');

const remoteRoot = process.env.FTP_REMOTE_PATH || "/webroots/sites/palmeclub.nl/";

const config = {
  host: "ftp.cnl0xaemr.service.one",
  user: process.env.FTP_USER || "cnl0xaemr_u",
  password: process.env.FTP_PASSWORD || "RYC!bag6dzc0mvp2bfh"
};

const filesToUpload = [
  'index.html',
  'instellingen.html',
  'app.js',
  'config.js',
  'instellingen.js',
  'styles.css',
  'LEESMIJ.md',
  'BRONNEN.md',
  'START-HIER.html'
];

const c = new Client();

c.on('ready', function() {
  console.log('✅ Connected to FTP server');
  console.log(`🔍 Attempting to navigate to: ${remoteRoot}`);
  
  // First, try to list the current directory to see where we are
  c.list('.', function(err, list) {
    if (err) {
      console.error(`❌ Error listing current directory: ${err.message}`);
      c.end();
      return;
    }
    
    console.log(`📂 Current FTP directory contents:`);
    list.forEach(item => {
      console.log(`   ${item.type === 'd' ? '📁' : '📄'} ${item.name}`);
    });
    
    // Now try to navigate to target
    c.cwd(remoteRoot, function(err) {
      if (err) {
        console.error(`❌ Cannot access directory: ${remoteRoot}`);
        console.error(`Error: ${err.message}`);
        c.end();
        return;
      }
      
      console.log(`✅ Navigated to: ${remoteRoot}`);
      console.log('');
      
      let uploaded = 0;
      let failed = 0;
      
      // First, try to upload assets
      const assetsDir = path.join(__dirname, 'assets');
      const assetsFiles = fs.readdirSync(assetsDir);
      
      function uploadNextFile(fileList, isAsset = false) {
        if (fileList.length === 0) {
          if (!isAsset) {
            // After files, upload assets
            uploadNextFile(assetsFiles, true);
            return;
          }
          
          console.log('');
          console.log('✅ Deployment successful!');
          console.log(`📤 ${uploaded} files uploaded`);
          if (failed > 0) {
            console.log(`⚠️  ${failed} files failed`);
          }
          c.end();
          return;
        }
        
        const file = fileList.shift();
        const localPath = isAsset 
          ? path.join(__dirname, 'assets', file)
          : path.join(__dirname, file);
        
        const remotePath = isAsset
          ? 'assets/' + file
          : file;
        
        if (!fs.existsSync(localPath)) {
          console.log(`⏭️  Skipping (not found): ${file}`);
          uploadNextFile(fileList, isAsset);
          return;
        }
        
        c.put(localPath, remotePath, function(err) {
          if (err) {
            console.log(`❌ Failed: ${file} - ${err.message.split('\n')[0]}`);
            failed++;
          } else {
            console.log(`✅ Uploaded: ${file}`);
            uploaded++;
          }
          uploadNextFile(fileList, isAsset);
        });
      }
      
      uploadNextFile(filesToUpload);
    });
  });
});

c.on('error', function(err) {
  console.error('❌ FTP Connection Error:', err.message);
  process.exit(1);
});

c.on('close', function() {
  process.exit(0);
});

console.log('🚀 Starting deployment to ftp.cnl0xaemr.service.one');
c.connect(config);
