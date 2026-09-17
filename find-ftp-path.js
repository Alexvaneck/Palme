const Client = require('ftp');
const fs = require('fs');
const path = require('path');

const config = {
  host: "ftp.cnl0xaemr.service.one",
  user: "cnl0xaemr_u",
  password: "RYC!bag6dzc0mvp2bfh"
};

const c = new Client();

c.on('ready', function() {
  console.log('✅ Connected to FTP server');
  
  // Try to upload a test file
  const testFile = path.join(__dirname, 'test-upload.txt');
  fs.writeFileSync(testFile, 'Test upload at ' + new Date().toISOString());
  
  const uploadPath = '/test-upload.txt';
  
  c.put(testFile, uploadPath, function(err) {
    if (err) {
      console.log('❌ Upload to root failed:', err.message);
      
      // Try uploading to a subdirectory
      console.log('\n🔄 Trying alternative paths...');
      tryUploadPaths(c, testFile);
      return;
    }
    
    console.log('✅ Test file uploaded successfully to:', uploadPath);
    fs.unlinkSync(testFile);
    c.end();
  });
});

function tryUploadPaths(c, testFile) {
  const paths = [
    '/public',
    '/public_html',
    '/www',
    '/htdocs',
    '/home'
  ];
  
  let pathIndex = 0;
  
  function tryNext() {
    if (pathIndex >= paths.length) {
      console.log('❌ None of the common paths worked');
      fs.unlinkSync(testFile);
      c.end();
      return;
    }
    
    const dir = paths[pathIndex];
    c.put(testFile, dir + '/test-upload.txt', function(err) {
      if (err) {
        console.log(`   ❌ ${dir}: ${err.message.split('\n')[0]}`);
        pathIndex++;
        tryNext();
      } else {
        console.log(`   ✅ Success with path: ${dir}`);
        console.log(`   📝 Use: FTP_REMOTE_PATH="${dir}/" npm run deploy`);
        fs.unlinkSync(testFile);
        c.end();
      }
    });
  }
  
  tryNext();
}

c.on('error', function(err) {
  console.error('❌ FTP Connection Error:', err.message);
  process.exit(1);
});

c.on('close', function() {
  console.log('\n✅ FTP connection closed');
  process.exit(0);
});

console.log('🔌 Connecting and testing upload paths...');
c.connect(config);
