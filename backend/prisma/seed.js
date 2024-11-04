const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid')

const prisma = new PrismaClient();

async function main() {
  // Create an admin
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: await bcrypt.hash('admin123@123', 10),
      firstName: 'Admin',
      lastName: 'User',
      emailVerified: true,
      birthDate: new Date('1990-01-01'),
    },
  });

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
      userId: admin.id,
      token: nanoid(),
    },
  });

  await prisma.emailVerification.create({
    data: {
      userId: user.id,
      token: nanoid(),
    },
  });

  // Create a password reset token for the user
  await prisma.passwordReset.create({
    data: {
      userId: admin.id,
      token: nanoid(),
    },
  });
  
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token: nanoid(),
    },
  });

  // Create an email change request for the user
  await prisma.emailChange.create({
    data: {
      userId: admin.id,
      newEmail: 'admin.new@example.com',
      token: nanoid(),
    },
  });
  
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
