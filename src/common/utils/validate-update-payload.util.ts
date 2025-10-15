import { BadRequestException } from '@nestjs/common';

export function validateUpdatePayload(obj: any): any {
  const cleaned: any = {};

  for (const key in obj) {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  }

  if (Object.keys(cleaned).length === 0) {
    throw new BadRequestException('No fields provided for update');
  }

  return cleaned;
}
