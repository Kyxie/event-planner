export class Response {
  static success(res, data = {}, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    })
  }

  static error(res, message = 'Error', statusCode = 500, data = {}) {
    return res.status(statusCode).json({
      success: false,
      message,
      data,
    })
  }

  static badRequest(res, message = 'Bad Request', data = {}) {
    return this.error(res, message, 400, data)
  }

  static notFound(res, message = 'Not Found', data = {}) {
    return this.error(res, message, 404, data)
  }

  static unauthorized(res, message = 'Unauthorized', data = {}) {
    return this.error(res, message, 401, data)
  }
}
