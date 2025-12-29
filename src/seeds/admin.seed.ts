import * as bcrypt from 'bcrypt';
import { AppDataSource } from 'src/data-source';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserRoles } from 'src/modules/user/enums/user-roles.enum';

export async function seedAdmin(): Promise<void> {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) return;
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  try {
    const userRepository = AppDataSource.getRepository(UserEntity);
    if (
      !(await userRepository.exists({
        where: { email: ADMIN_EMAIL },
      }))
    ) {
      await userRepository.save({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: await bcrypt.hash(ADMIN_PASSWORD, 10),
        role: UserRoles.ADMIN,
      });
    }
  } finally {
    await AppDataSource.destroy();
  }
}

void seedAdmin();
