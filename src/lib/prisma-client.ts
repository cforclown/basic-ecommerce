import { PrismaClient } from '@prisma/client'

export const prismaClient = new PrismaClient({
  log: ['query']
}).$extends({
  result: {
    address: {
      formattedAddress: {
        needs: {
          address: true,
          city: true,
          state: true,
          zipCode: true
        },
        compute: (address) => {
          return `${address.address},${address.city},${address.state},${address.zipCode}`
        }
      }
    }
  }
})
