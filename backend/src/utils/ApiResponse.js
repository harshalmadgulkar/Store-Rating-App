// Enum-like object for HTTP status codes
export const ResponseStatus = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

// Base API response class
class ApiResponse {
  constructor(statusCode, status, message) {
    this.statusCode = statusCode;
    this.status = status;
    this.message = message;
  }

  prepare(res, response, headers = {}) {
    for (const [key, value] of Object.entries(headers)) {
      res.append(key, value);
    }
    return res.status(this.status).json(ApiResponse.sanitize(response));
  }

  send(res, headers = {}) {
    return this.prepare(res, this, headers);
  }

  static sanitize(response) {
    if (typeof response.toJSON === 'function') {
      return response.toJSON();
    }
    const clone = {};
    for (const key in response) {
      if (response[key] !== undefined) {
        clone[key] = response[key];
      }
    }
    return clone;
  }
}

// Response types
export class AuthFailureResponse extends ApiResponse {
  constructor(message = 'Authentication Failure') {
    super(ResponseStatus.UNAUTHORIZED, ResponseStatus.UNAUTHORIZED, message);
  }
}

export class NotFoundResponse extends ApiResponse {
  constructor(message = 'Not Found') {
    super(ResponseStatus.NOT_FOUND, ResponseStatus.NOT_FOUND, message);
  }

  send(res, headers = {}) {
    return super.prepare(res, this, headers);
  }
}

export class ForbiddenResponse extends ApiResponse {
  constructor(message = 'Forbidden') {
    super(ResponseStatus.FORBIDDEN, ResponseStatus.FORBIDDEN, message);
  }
}

export class BadRequestResponse extends ApiResponse {
  constructor(message = 'Bad Parameters') {
    super(ResponseStatus.BAD_REQUEST, ResponseStatus.BAD_REQUEST, message);
  }
}

export class BadRequestResponseWithData extends ApiResponse {
  constructor(message = 'Bad Parameters', data = null) {
    super(ResponseStatus.BAD_REQUEST, ResponseStatus.BAD_REQUEST, message);
    this.data = data;
  }

  send(res, headers = {}) {
    return super.prepare(res, this, headers);
  }
}

export class InternalErrorResponse extends ApiResponse {
  constructor(message = 'Internal Error') {
    super(ResponseStatus.INTERNAL_ERROR, ResponseStatus.INTERNAL_ERROR, message);
  }
}

export class SuccessMsgResponse extends ApiResponse {
  constructor(message) {
    super(ResponseStatus.SUCCESS, ResponseStatus.SUCCESS, message);
  }
}

export class FailureMsgResponse extends ApiResponse {
  constructor(message) {
    super(ResponseStatus.SUCCESS, ResponseStatus.SUCCESS, message);
  }
}

export class SuccessResponse extends ApiResponse {
  constructor(message, data) {
    super(ResponseStatus.SUCCESS, ResponseStatus.SUCCESS, message);
    this.data = data;
  }

  send(res, headers = {}) {
    return super.prepare(res, this, headers);
  }
}

export class AccessTokenErrorResponse extends ApiResponse {
  constructor(message = 'Access token invalid') {
    super(ResponseStatus.UNAUTHORIZED, ResponseStatus.UNAUTHORIZED, message);
    this.instruction = 'refresh_token';
  }

  send(res, headers = {}) {
    headers.instruction = this.instruction;
    return super.prepare(res, this, headers);
  }
}

export class TokenRefreshResponse extends ApiResponse {
  constructor(message, accessToken, refreshToken) {
    super(ResponseStatus.SUCCESS, ResponseStatus.SUCCESS, message);
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  send(res, headers = {}) {
    return super.prepare(res, this, headers);
  }
}

export class PaginateResponse extends ApiResponse {
  constructor(message, data = null, metadata = null, error = null) {
    super(ResponseStatus.SUCCESS, ResponseStatus.SUCCESS, message);
    this.data = data;
    this.metadata = metadata;
    this.error = error;
  }

  toJSON() {
    const resData = {
      status: this.statusCode,
      message: this.message,
      error: this.error || null,
    };

    if (this.metadata) {
      resData.token = this.metadata;
    }

    if (this.data && typeof this.data === 'object') {
      const dataObj = this.data;
      resData.data = 'data' in dataObj ? dataObj.data : dataObj;

      for (const key in dataObj) {
        if (key !== 'data' && dataObj[key] !== undefined) {
          resData[key] = dataObj[key];
        }
      }
    } else {
      resData.data = this.data ?? null;
    }

    return resData;
  }

  send(res, headers = {}) {
    return super.prepare(res, this, headers);
  }
}
