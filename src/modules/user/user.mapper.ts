import { UserModel } from '@user/models/user.model';
import { UserDto } from '@user/dto/user.dto';

export class UserMapper {
  static toDto({ id, display_name, thumbnail, introduction  }: UserModel): UserDto {
    return {
      id,
      display_name,
      thumbnail,
      introduction,
    };
  }
}