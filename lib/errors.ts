import url from 'url'

function packageName (href) {
  try {
    let basePath = new url.URL(href).pathname.slice(1)
    if (!basePath.match(/^-/)) {
      basePath = basePath.split('/')
      var index = basePath.indexOf('_rewrite')
      if (index === -1) {
        index = basePath.length - 1
      } else {
        index++
      }
      return decodeURIComponent(basePath[index])
    }
  } catch (_) {
    // this is ok
  }
}

class HttpErrorBase extends Error {
  constructor (method, res, body, spec) {
    super()
    this.name = this.constructor.name
    this.headers = res.headers.raw()
    this.statusCode = res.status
    this.code = `E${res.status}`
    this.method = method
    this.uri = res.url
    this.body = body
    this.pkgid = spec ? spec.toString() : packageName(res.url)
  }
}

export { HttpErrorBase }

class HttpErrorGeneral extends HttpErrorBase {
  constructor (method, res, body, spec) {
    super(method, res, body, spec)
    this.message = `${res.status} ${res.statusText} - ${
      this.method.toUpperCase()
    } ${
      this.spec || this.uri
    }${
      (body && body.error) ? ' - ' + body.error : ''
    }`
    Error.captureStackTrace(this, HttpErrorGeneral)
  }
}

export { HttpErrorGeneral }

class HttpErrorAuthOTP extends HttpErrorBase {
  constructor (method, res, body, spec) {
    super(method, res, body, spec)
    this.message = 'OTP required for authentication'
    this.code = 'EOTP'
    Error.captureStackTrace(this, HttpErrorAuthOTP)
  }
}

export { HttpErrorAuthOTP }

class HttpErrorAuthIPAddress extends HttpErrorBase {
  constructor (method, res, body, spec) {
    super(method, res, body, spec)
    this.message = 'Login is not allowed from your IP address'
    this.code = 'EAUTHIP'
    Error.captureStackTrace(this, HttpErrorAuthIPAddress)
  }
}

export { HttpErrorAuthIPAddress }

class HttpErrorAuthUnknown extends HttpErrorBase {
  constructor (method, res, body, spec) {
    super(method, res, body, spec)
    this.message = 'Unable to authenticate, need: ' + res.headers.get('www-authenticate')
    Error.captureStackTrace(this, HttpErrorAuthUnknown)
  }
}

export { HttpErrorAuthUnknown }
