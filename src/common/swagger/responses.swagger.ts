import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const SwaggerBadRequest = () =>
  ApiBadRequestResponse({ description: 'Bad Request' });

export const SwaggerUnauthorized = () =>
  ApiUnauthorizedResponse({ description: 'Unauthorized' });

export const SwaggerForbidden = () =>
  ApiForbiddenResponse({ description: 'Forbidden' });

export const SwaggerNotFound = () =>
  ApiNotFoundResponse({ description: 'Not Found' });

export const SwaggerConflict = () =>
  ApiConflictResponse({ description: 'Conflict' });

export const SwaggerInternalServerError = () =>
  ApiInternalServerErrorResponse({ description: 'Internal Server Error' });
