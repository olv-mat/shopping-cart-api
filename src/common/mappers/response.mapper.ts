import { Injectable } from '@nestjs/common';
import { DefaultResponseDto } from '../dtos/DefaultResponse.dto';
import { MessageResponseDto } from '../dtos/MessageResponse.dto';

@Injectable()
export class ResponseMapper {
  public toDefaultResponse(uuid: string, message: string): DefaultResponseDto {
    return new DefaultResponseDto(uuid, message);
  }

  public toMessageResponse(message: string): MessageResponseDto {
    return new MessageResponseDto(message);
  }
}
