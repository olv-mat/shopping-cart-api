import * as bcrypt from 'bcrypt';
import { AppDataSource } from 'src/config/data-source';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserRoles } from 'src/modules/user/enums/user-roles.enum';

export async function createAdmin(): Promise<void> {
  await AppDataSource.initialize();
  const userRepository = AppDataSource.getRepository(UserEntity);

  const adminName = process.env.ADMIN_NAME!;
  const adminEmail = process.env.ADMIN_EMAIL!;
  const adminPassword = process.env.ADMIN_PASSWORD!;

  const adminExists = await userRepository.exists({
    where: { email: adminEmail },
  });
  if (!adminExists) {
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
    const admin = userRepository.create({
      name: adminName,
      email: adminEmail,
      password: adminPasswordHash,
      role: UserRoles.ADMIN,
    });
    await userRepository.save(admin);
    console.log('Admin created successfully');
  } else {
    console.log('Admin already exists');
  }
  await AppDataSource.destroy();
}

createAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
