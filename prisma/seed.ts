// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  await Promise.all([
    prisma.user.createMany({
      data: [
        { 
          name: 'Admin',
          email: 'admin@email.com',
          password: hashSync('admin', 10),
          role: 'ADMIN',
        },
      ],
    }),
    prisma.product.createMany({
      data: [
        { 
          name: 'Product 1',
          description: 'Product 1',
          price: 101,
          tags: 'tag1',
        },
        { 
          name: 'Product 2',
          description: 'Product 2',
          price: 102,
          tags: 'tag3',
        },
        { 
          name: 'Product 3',
          description: 'Product 3',
          price: 103,
          tags: 'tag3',
        },
        { 
          name: 'Product 4',
          description: 'Product 4',
          price: 104,
          tags: 'tag4',
        },
        { 
          name: 'Product 5',
          description: 'Product 5',
          price: 105,
          tags: 'tag5',
        },
      ],
    }),
  ])

  console.log('Seeding complete 🌱');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
