import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      username: 'john_doe',
      email: 'john.doe@example.com',
      passwordHash: await bcrypt.hash('password123', 10),
      firstName: 'John',
      lastName: 'Doe',
      emailVerified: true,
      birthDate: new Date('1990-01-01'),
    },
  });

  // Create an email verification token for the user
  await prisma.emailVerification.create({
    data: {
      userId: user.id,
      token: nanoid(),
    },
  });

  // Create a password reset token for the user
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token: nanoid(),
    },
  });

  // Create an email change request for the user
  await prisma.emailChange.create({
    data: {
      userId: user.id,
      newEmail: 'john.new@example.com',
      token: nanoid(),
    },
  });

  console.log('Database has been seeded. 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
