import { Express } from 'express'
import request from 'supertest';
import { container, setupDIContainer } from '../../di-config';
import { HttpStatusCode } from '../../utils/exceptions';
import { mockUser } from '../../test/mock-data/users';
import { generateRandomEmail } from '../../test/utils/generate-mock-email';

describe('auth', () => {
  describe('User sign-up', () => {
    let app: Express;

    const sampleUserData = {
      ...mockUser,
      email: generateRandomEmail(),
    }

    beforeAll(async () => {
      setupDIContainer();
      app = container.resolve('app');
    });

    it('user signup -> signin -> get data /api/auth/me', async () => {
      let response = await request(app)
        .post('/api/auth/signup')
        .send({ ...sampleUserData })
        .expect(HttpStatusCode.Ok);

      expect(response).toHaveProperty('text');
      let body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('user');
      expect(body.data).toHaveProperty('token');

      response = await request(app)
        .post('/api/auth/signin')
        .send({ 
          email: sampleUserData.email,
          password: sampleUserData.password
        })
        .expect(HttpStatusCode.Ok);
      expect(response).toHaveProperty('text');
      body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('token');
      const accessToken = body.data.token;

      response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatusCode.Ok);

      expect(response).toHaveProperty('text');
      body = JSON.parse(response.text);
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('id');
      expect(body.data.name).toEqual(sampleUserData.name);
      expect(body.data.email).toEqual(sampleUserData.email);
    });

    // it('user add product to cart', async () => {
    //   const response = await request(app)
    //     .post('/api/cart')
    //     .send({
    //       productId: selectedProduct.id,
    //       quantity: 1
    //     })
    //     .set('Authorization', `Bearer ${userAccessToken}`)
    //     .expect(HttpStatusCode.Ok);

    //   expect(response).toHaveProperty('text');
    //   const body = JSON.parse(response.text);
    //   expect(body).toHaveProperty('data');
    //   expect(body.data).toHaveProperty('id');
    // });

    // it('create order', async () => {
    //   const response = await request(app)
    //     .post('/api/orders')
    //     .set('Authorization', `Bearer ${userAccessToken}`)
    //     .expect(HttpStatusCode.Ok);

    //   expect(response).toHaveProperty('text');
    //   const body = JSON.parse(response.text);
    //   expect(body).toHaveProperty('data');
    //   expect(body.data).toHaveProperty('id');
    // });
  })
});
