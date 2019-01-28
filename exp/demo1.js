const shttp = require('http');
const userConf = {
 path: 'https://localhost:5001/api/',
 method: 'POST'
};


const appDetails = {
    UserID: 'sandboxadmin',
    Password: 'xxxxx',
    LoginType: 'LOGIN'
   };
   
   const httpRequest = shttp.request(userConf, function (res) {
    res.setEncoding('utf8');
    if (res.statusCode == 200) {
     let body = "";
     res.on('data', function (result) {
      body += result;
     });
     res.on('end', function () {
      console.log("API response is\n");
      console.log(body);
     });
    } else {
     console.log('Request failed:' + res.statusCode);
    }
   });
   
   httpRequest.on('error', function (e) {
    console.log('Request failed error :: ' + e);
   });
   
   httpRequest.write('body=' + JSON.stringify(appDetails));
   httpRequest.end();