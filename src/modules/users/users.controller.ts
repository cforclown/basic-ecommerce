/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request } from 'express';
import { Address, User } from '@prisma/client';
import { prismaClient } from '../../lib/prisma-client';
import { BadRequestException, NotFoundException, RestApiErrorCode } from '../../utils/exceptions';

export class UsersController {
  public async getAddresses(req: Request) {
    const addresses = await prismaClient.address.findMany({
      where: {
        userId: req.user.id
      }
    });
    
    return addresses;
  }
    
  public async addAddress(req: Request) {
    try {
      await prismaClient.user.findFirstOrThrow({
        where: {
          id: req.user.id
        }
      })

      const address = await prismaClient.address.create({
        data: {
          ...req.body,
          userId: req.user.id
        }
      });
      
      return address;
    } catch (error) {
      throw new NotFoundException('User not found', RestApiErrorCode.USER_NOT_FOUND)
    }
  }
    
  public async deleteAddress(req: Request) {
    try {
      await prismaClient.address.delete({
        where: {
          id: req.params.id
        }
      });
    
      return 'OK';
    } catch (error) {
      throw new NotFoundException('Address not found', RestApiErrorCode.ADDRESS_NOT_FOUND)
    }
  }
    
  public async updateUser(req: Request) {
    const data = req.body
    let shippingAddress: Address;
    let billingAddress: Address
    
    if (data.defaultShippingAddress) {
      try {
        shippingAddress = await prismaClient.address.findFirstOrThrow({
          where: {
            id: data.defaultShippingAddress
          }
        })
      } catch (error) {
        throw new NotFoundException('Address not found', RestApiErrorCode.ADDRESS_NOT_FOUND);
      }
      if (shippingAddress.userId !== req.user.id) {
        throw new BadRequestException('Address does not belong to user', RestApiErrorCode.ADDRESS_DOES_NOT_BELONG);
      }
    }
    
    if (data.defaultBillingAddress) {
      try {
        billingAddress = await prismaClient.address.findFirstOrThrow({
          where: {
            id: data.defaultBillingAddress
          }
        })
    
      } catch (error) {
        throw new NotFoundException('Address not found', RestApiErrorCode.ADDRESS_NOT_FOUND);
      }
      if (billingAddress.userId !== req.user.id) {
        throw new BadRequestException('Address does not belong to user', RestApiErrorCode.ADDRESS_DOES_NOT_BELONG);
      }
    }
    
    
    const updatedUser = await prismaClient.user.update({
      where: {
        id: req.user.id
      },
      data: data
    })
    
    return updatedUser;
  }
    
  public async getAllUsers(req: Request) {
    const users = await prismaClient.user.findMany({
      skip: req.query.skip ? Number(req.query.skip) : 0,
      take: 5
    });
    
    return users;
  }
  
  public async getUserById(req: Request) {
    try {
      const user = await prismaClient.user.findFirstOrThrow({
        where: {
          id: req.params.id
        },
        include: {
          addresses: true
        }
      })

      return user;
    } catch (error) {
      throw new NotFoundException('User not found', RestApiErrorCode.USER_NOT_FOUND);
    
    }
  }
}
