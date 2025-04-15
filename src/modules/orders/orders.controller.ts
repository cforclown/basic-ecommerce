/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { prismaClient } from '../../lib/prisma-client';
import { NotFoundException, RestApiErrorCode } from '../../utils/exceptions';
import { CartItem } from '@prisma/client';

export class OrdersController {
  public async createOrder(req: Request) {
    return await prismaClient.$transaction(async (tx) => {
      const userId = req.user.id;
      let addressId = req.user.defaultShippingAddressId;
      if(!addressId) {
        if(!req.body.address) {
          throw new NotFoundException('Address not found', RestApiErrorCode.ADDRESS_NOT_FOUND)
        }

        const address = await tx.address.create({
          data: {
            ...req.body.address,
            userId
          }
        })
        addressId = address.id;
      }
      
      const cartItems = await tx.cartItem.findMany({
        where: {
          userId
        },
        include: {
          product: true
        }
      })
  
      if (cartItems.length === 0) {
        return 'Cart is empty';
      }
  
      const totalPrice = cartItems.reduce((prev: any, current: any) => {
        return prev + (current.quantity * +current.product.price)
      }, 0);
  
      const address: any = await tx.address.findFirst({
        where: {
          id: addressId
        }
      })
  
      const order = await tx.order.create({
        data: {
          userId,
          netAmount: totalPrice,
          address: address?.formattedAddress,
          products: {
            create: cartItems.map((cart) => {
              return {
                productId: cart.productId,
                productName: cart.product.name,
                productPrice: cart.product.price,
                productDescription: cart.product.description,
                productTags: cart.product.tags,
                quantity: cart.quantity,
                shippingFees: 5.99,
              }
            })
          }
        }
      })
  
      await Promise.all([
        tx.orderEvent.create({
          data: {
            orderId: order.id
          }
        }),
        tx.cartItem.deleteMany({
          where: {
            userId
          }
        })]);

      return order
    })
  }
  
  public async listOrders(req: Request) {
  
    const orders = await prismaClient.order.findMany({
      where: {
        userId: req.user.id
      }
    });
    
    return orders;
  }
  
  public async cancelOrder(req: Request) {
  
    try {
  
      const order = await prismaClient.order.update({
        where: {
          id: req.params.id
        },
        data: {
          status: 'CANCELLED'
        }
      })
  
      await prismaClient.orderEvent.create({
        data: {
          orderId: order.id,
          status: 'CANCELLED'
        }
      })

      return 'OK';
    } catch (error) {
      throw new NotFoundException('Order not found', RestApiErrorCode.ORDER_NOT_FOUND);
    }
  }
  
  public async getOrderById(req: Request) {
    try {
  
      const order = await prismaClient.order.findFirstOrThrow({
        where: {
          id: req.params.id
        },
        include: {
          products: true,
          events: true
        }
      })
  
      return order;
    } catch (error) {
      throw new NotFoundException('Order not found', RestApiErrorCode.ORDER_NOT_FOUND);
    }
  }
  
  // Admin
  public async listAllOrders(req: Request) {
    const selectFields = req.query.fields ? req.query.fields.toString().split(',') : undefined;
    const selectStatements = selectFields?.reduce((acc: Record<string, any>, field: string) => {
      if (this.validateOrderFields(field)) {
        acc[field] = true;
      }

      return acc;
    }, {});
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const skip = (page - 1) * limit;
    const orderBy = req.query.orderBy ? req.query.orderBy.toString() : 'createdAt';
    const sort = req.query.sort ? req.query.sort.toString() : 'desc';
    const orderByClause = {
      [orderBy]: sort
    };
    const status = req.query.status;

    let whereClause = {}
    if (status) {
      whereClause = {
        status
      }
    }
  
    const orders = await prismaClient.order.findMany({
      select: selectStatements,
      where: whereClause,
      orderBy: orderByClause,
      skip: skip,
      take: limit,
    })
  
    return orders;
  }
  
  public async changeStatus(req: Request) {
  
    try {
      const order = await prismaClient.order.update({
        where: {
          id: req.params.id
        },
        data: {
          status: req.body.status
        }
      })
  
      await prismaClient.orderEvent.create({
        data: {
          orderId: order.id,
          status: req.body.status
        }
      })
  
      return order;
    } catch (error) {
      throw new NotFoundException('Order not found', RestApiErrorCode.ORDER_NOT_FOUND);
    }
  }
  
  public async listUserOrders(req: Request) {
    const selectFields = req.query.fields ? req.query.fields.toString().split(',') : undefined;
    const selectStatements = selectFields?.reduce((acc: Record<string, any>, field: string) => {
      if (this.validateOrderFields(field)) {
        acc[field] = true;
      }

      return acc;
    }, {});
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const skip = (page - 1) * limit;
    const orderBy = req.query.orderBy ? req.query.orderBy.toString() : 'createdAt';
    const sort = req.query.sort ? req.query.sort.toString() : 'desc';
    const orderByClause = {
      [orderBy]: sort
    };

    const whereClause: Record<string, any> = {
      userId: req.params.id
    }
    const status = req.params.status;
    if (status) {
      whereClause.status = status
    }
  
    const orders = await prismaClient.order.findMany({
      select: selectStatements,
      where: whereClause,
      orderBy: orderByClause,
      skip: skip,
      take: limit,
    })
  
    return orders;
  }

  private validateOrderFields(field: string): boolean {
    const allowedFields = ['userId', 'netAmount', 'address', 'products', 'status', 'createdAt', 'updatedAt'];
    return allowedFields.includes(field);
  }
}
