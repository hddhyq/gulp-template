const os = require('os');
const net = require('net');
const host = showObj(os.networkInterfaces());

const getPort = async function () {
  const a = await getPortPromise();
  console.log(a)
  return a
}

function getPortPromise() {
  return new Promise((resolve) => {
    portIsOccupied(1234);
    function portIsOccupied(port) {
      // 创建服务并监听该端口
      var server = net.createServer().listen(port, host);

      server.on('listening', function () { // 执行这块代码说明端口未被占用
        server.close() // 关闭服务
        resolve(port)
      })

      server.on('error', function (err) {
        if (err.code === 'EADDRINUSE') { // 端口已经被使用
          port += 1;
          portIsOccupied(port);
        }
      })
    }
  })
}

// 获取本地IP地址
function showObj(obj) {
  for (var devName in obj) {
    var iface = obj[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}

module.exports = {
  host,
  getPort
}