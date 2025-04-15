/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import { CartItem, Product } from '@prisma/client';
import { NotFoundException, RestApiErrorCode } from '../../utils/exceptions';
import { prismaClient } from '../../lib/prisma-client';

export class CartController {
  public async addItemToCart(req: Request){
    try {
      const userId = req.user.id;
      const { productId, quantity } = req.body;

      const product = await prismaClient.product.findFirstOrThrow({
        where: {
          id: productId
        }
      })
  
      const cart = await prismaClient.cartItem.create({
        data: {
          userId,
          productId: product.id,
          quantity: quantity
        }
      });
    
      return cart;
    } catch (error) {
      throw new NotFoundException('Product not found', RestApiErrorCode.PRODUCT_NOT_FOUND)
    }
  }
  
  public async deleteItemFromCart(req: Request){
    try {
      await prismaClient.cartItem.delete({
        where: {
          id: req.params.id
        }
      })
      
      return 'OK';
    } catch (error) {
      throw new NotFoundException('Product not found', RestApiErrorCode.PRODUCT_NOT_FOUND)
    }
  }
  
  public async changeQuantity(req: Request){
    const data = req.body;
  
    const updatedCart = await prismaClient.cartItem.update({
      where: {
        id: req.params.id
      },
      data: {
        quantity: data.quantity
      }
    });
  
    return updatedCart;
  }
  
  public async getCart(req: Request){
    const cart = await prismaClient.cartItem.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        product: true
      }
    });
  
    return cart;
  }
}
