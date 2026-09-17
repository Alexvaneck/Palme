const Client = require('ftp');

const config = {
  host: "ftp.cnl0xaemr.service.one",
  user: "cnl0xaemr_u",
  password: "RYC!bag6dzc0mvp2bfh"
};

const c = new Client();

c.on('ready', function() {
  console.log('✅ Connected to FTP server');
  
  // Try to list the root directory
  c.list('/', function(err, list) {
    if (err) {
      console.log('❌ Error listing root directory:', err.message);
      c.end();
      return;
    }
    
    console.log('📂 Root directory contents:');
    if (list.length === 0) {
      console.log('   (empty)');
    } else {
      list.forEach(file => {
        console.log(`   ${file.type === 'd' ? '📁' : '📄'} ${file.name}`);
      });
    }
    
    c.end();
  });
});

c.on('error', function(err) {
  console.error('❌ FTP Connection Error:', err.message);
  process.exit(1);
});

c.on('close', function() {
  console.log('\n✅ FTP connection closed');
  process.exit(0);
});

console.log('🔌 Connecting to ftp.cnl0xaemr.service.one...');
c.connect(config);
