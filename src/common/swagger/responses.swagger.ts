import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const SwaggerCreated = () =>
  ApiCreatedResponse({
    description: 'Created',
    schema: {
      example: {
        message: 'Created',
        statusCode: 201,
      },
    },
  });

export const SwaggerBadRequest = () =>
  ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      example: {
        message: 'Bad Request',
        statusCode: 400,
      },
    },
  });

export const SwaggerUnauthorized = () =>
  ApiUnauthorizedResponse({
    description: 'Unauthorized',
    schema: {
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
  });

export const SwaggerForbidden = () =>
  ApiForbiddenResponse({
    description: 'Forbidden',
    schema: {
      example: {
        message: 'Forbidden',
        statusCode: 403,
      },
    },
  });

export const SwaggerNotFound = () =>
  ApiNotFoundResponse({
    description: 'Not Found',
    schema: {
      example: {
        message: 'Not Found',
        statusCode: 404,
      },
    },
  });

export const SwaggerConflict = () =>
  ApiConflictResponse({
    description: 'Conflict',
    schema: {
      example: {
        message: 'Conflict',
        statusCode: 409,
      },
    },
  });

export const SwaggerInternalServerError = () =>
  ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
  });
