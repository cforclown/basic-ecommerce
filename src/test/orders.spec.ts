import { Express } from 'express'
import request from 'supertest';
import { Address, Product, User } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { container, setupDIContainer } from '../di-config';
import { HttpStatusCode } from '../utils/exceptions';
import { mockUser, mockAdmin } from './mock-data/users';
import { prismaClient } from '../lib/prisma-client';
import { mockProducts } from './mock-data/products';
import { mockAddress } from './mock-data/addresses';
import { generateRandomEmail } from './utils/generate-mock-email';

describe('orders', () => {
  describe('user login - search for products - add to cart - create order - admin set order status - user list orders', () => {
    let app: Express;
    let admin: User;
    let adminAccessToken: string;
    let user: User;
    let userAddress: Address;
    let userAccessToken: string;
    let selectedProduct: Product;

    beforeAll(async () => {
      setupDIContainer();
      app = container.resolve('app');

      const existingProducts = await prismaClient.product.findMany();
      if (!existingProducts.length) {
        await Promise.all(mockProducts.map((p) => prismaClient.product.create({
          data: {...p}
        })));
      }
      admin = await prismaClient.user.create({
        data: { 
          ...mockAdmin,
          email:generateRandomEmail(),
          password: hashSync(mockAdmin.password, 10),
        }
      });
      admin.password = mockAdmin.password;
      user = await prismaClient.user.create({
        data: { 
          ...mockUser,
          email:generateRandomEmail(),
          password: hashSync(mockUser.password, 10), 
        }
      });
      user.password = mockUser.password;
      userAddress = await prismaClient.address.create({
        data: {
          ...mockAddress,
          userId: user.id
        }
      });
      await prismaClient.user.update({
        where: { id: user.id },
        data: {
          defaultShippingAddressId: userAddress.id
        }
      });
    });

    it('user and admin login - should login successfully', async () => {
      let response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: user.email,
          password: user.password
        })
        .expect(HttpStatusCode.Ok);

      expect(response).toHaveProperty('text');
      let body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('user');
      expect(body.data).toHaveProperty('token');

      userAccessToken = body.data.token;

      response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: admin.email,
          password: admin.password
        })
        .expect(HttpStatusCode.Ok);

      expect(response).toHaveProperty('text');
      body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('user');
      expect(body.data).toHaveProperty('token');

      admin = body.data.user;
      adminAccessToken = body.data.token;
    });

    it('user search for products', async () => {
      const response = await request(app)
        .get('/api/products/search')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(HttpStatusCode.Ok);

      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data.length).toBeGreaterThan(0);

      selectedProduct = body.data[0];
      expect(selectedProduct).toHaveProperty('id');
    });

    it('user add product to cart', async () => {
      const response = await request(app)
        .post('/api/cart')
        .send({
          productId: selectedProduct.id,
          quantity: 1
        })
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(HttpStatusCode.Ok);

      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('id');
    });

    it('create order', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(HttpStatusCode.Ok);

      expect(response).toHaveProperty('text');
      const body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('id');
    });
  })
});
