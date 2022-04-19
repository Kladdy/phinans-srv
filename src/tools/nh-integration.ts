function _interopRequireDefault(module: any) {
  const
      isCJSModule = module && module.__esModule,
      cjsStyedModule = { default: module };

  return isCJSModule ? module: cjsStyedModule;
}

var _cryptoJs = _interopRequireDefault(require('crypto-js'))
var _qs = require('qs');
import https from 'https';

function createNonce() {
  var s = ''
  const length = 32

  do {
      s += Math.random()
          .toString(36)
          .substring(2)
  } while (s.length < length)

  s = s.substring(0, length)
  return s
}

const getAuthHeader = (apiKey: string, apiSecret: string, time: string, nonce: string, organizationId: string, method: string, path: string, query: string, body: string) => {

  const hmac = _cryptoJs.default.algo.HMAC.create(
      _cryptoJs.default.algo.SHA256,
      apiSecret
  )

  hmac.update(apiKey)
  hmac.update('\0')
  hmac.update(time)
  hmac.update('\0')
  hmac.update(nonce)
  hmac.update('\0')
  hmac.update('\0')
  if (organizationId) hmac.update(organizationId)
  hmac.update('\0')
  hmac.update('\0')
  hmac.update(method)
  hmac.update('\0')
  hmac.update(path)
  hmac.update('\0')
  if (query)
      hmac.update(
          typeof query == 'object'
              ? _qs.default.stringify(query)
              : query
      )

  if (body) {
      hmac.update('\0')
      hmac.update(
          typeof body == 'object'
              ? JSON.stringify(body)
              : body
      )
  }

  return apiKey + ':' + hmac.finalize().toString(_cryptoJs.default.enc.Hex)
}

const getBalances = (wallet: any) => {

  const apiKey = wallet.apiKey
  const apiSecret = wallet.apiSecret
  const time = Date.now().toString();
  const nonce = createNonce()
  const organizationId = wallet.organizationId
  const method = "GET"
  const path = "/main/api/v2/accounting/accounts2"
  const query: any = null
  const body: any = null

  const headers = {
    "X-Time": time,
    "X-Nonce": nonce,
    "X-Organization-Id": organizationId,
    "X-Request-Id": nonce,
    "X-Auth": getAuthHeader(apiKey, apiSecret, time, nonce, organizationId, method, path, query, body)
  }

  return new Promise<any>(((resolve, reject) => {

    const req = https.request(process.env.NEXT_PUBLIC_NH_URL + path,
    {
      method: method,
      headers: headers
    },
    (res) => {
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);
    
      let body = "";

      res.on("data", (chunk) => {
          body += chunk;
      });

      res.on("end", () => {
          try {
              let json = JSON.parse(body);
              resolve(json);
          } catch (error) {
              console.error(error.message);
              throw error
          };
      });

      // res.on('data', (d) => {
      //   process.stdout.write(d);
      //   console.log("yep, her is data", d)

      //   return d
      // });

      res.on('error', (e) => {
        console.error(e);
        throw e;
      })
    })
      
    req.on('error', (e) => {
      console.error(e);
      throw e;
    });

    req.end();

  }));
  
}

export default getBalances;