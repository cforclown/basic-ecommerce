/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import qs from 'qs';
import { prismaClient } from '../../lib/prisma-client';
import { NotFoundException, RestApiErrorCode } from '../../utils/exceptions';
import { Product } from '@prisma/client';


export class ProductsController {
  public createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const product = await prismaClient.product.create({
      data: {
        ...req.body,
        tags: req.body.tags.join(',')
      }
    });
      
    return product;
  }
  
  public updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  
    try {
      const product = req.body;
      if (product.tags) {
        product.tags = product.tags.tags.join(',')
      }
      const updatedProduct = await prismaClient.product.update({
        where: {
          id: req.params.id
        },
        data: product
      });
  
      return updatedProduct;
    } catch (error) {
      throw new NotFoundException('Product not found', RestApiErrorCode.PRODUCT_NOT_FOUND)
    }
  }
  
  public deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
  
      const deletedProduct = await prismaClient.product.delete({
        where: {
          id: req.params.id
        }
      })
  
      return deletedProduct;
    } catch (error) {
      throw new NotFoundException('Product not found', RestApiErrorCode.PRODUCT_NOT_FOUND)
    }
  }
  
  public listProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const count = await prismaClient.product.count();
      const skip: any = req.query.skip;
      const products = await prismaClient.product.findMany({
        skip: +skip || 0,
        take: 5
      });
      
      return {
        count, data: products
      };
    } catch (error) {
      throw new NotFoundException('Product not found', RestApiErrorCode.PRODUCT_NOT_FOUND)
  
    }
  }
  
  public getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
  
      const product = await prismaClient.product.findFirstOrThrow({
        where: {
          id: req.params.id
        }
      })
  
      return product;
    } catch (error) {
      throw new NotFoundException('Product not found', RestApiErrorCode.PRODUCT_NOT_FOUND)
    }
  }
  
  
  // For Admin & User
  
  public searchProducts = async (req: Request, res: Response) => {
    const selectFields= req.query.fields ? req.query.fields.toString().split(',') : undefined;
    const selectStatements = selectFields && selectFields.reduce((acc: Record<string, any>, field: string) => {
      if (this.validateSearchFields(field)) {
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

    const products = await prismaClient.product.findMany({
      select: selectStatements,
      where: {
        name: {
          search: req.query.q?.toString(),
        },
        description: {
          search: req.query.q?.toString(),
  
        },
        tags: {
          search: req.query.q?.toString(),
  
        }
      },
      orderBy: orderByClause,
      skip: skip,
      take: limit,
    })
  
    return products;
  }

  private validateSearchFields(field: string): boolean {
    const validFields = ['id', 'name', 'description', 'price', 'tags', 'createdAt', 'updatedAt'];
    return validFields.includes(field);
  }
}