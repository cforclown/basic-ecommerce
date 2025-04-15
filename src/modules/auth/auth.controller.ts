import { Request } from 'express';
import { hashSync, compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { BadRequestException, NotFoundException, RestApiErrorCode } from '../../utils/exceptions';
import { Environment } from '../../utils';


export class AuthController {
  private readonly db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;

    this.signin = this.signin.bind(this);
    this.signup = this.signup.bind(this);
    this.me = this.me.bind(this);
  }

  public signin = async (req: Request) => {
    const { email, password } = req.body;

    const user = await this.db.user.findFirst({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found', RestApiErrorCode.USER_NOT_FOUND)
    }
    if (!compareSync(password, user.password)) {
      throw new BadRequestException('Incorrect password', RestApiErrorCode.INCORRECT_PASSWORD);
    }

    const token = jwt.sign({
      ...user,
    }, Environment.getAccessTokenSecret());

    return { user, token };
  }

  public signup = async (req: Request) => {
    const { email, password, name } = req.body;

    let user = await this.db.user.findFirst({ where: { email } });
    if (user) {
      throw new NotFoundException('User not found', RestApiErrorCode.USER_NOT_FOUND)
    }

    user = await this.db.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10)
      }
    });

    const token = jwt.sign({
      ...user,
    }, Environment.getAccessTokenSecret());

    return { user, token };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public me = async (req: Request & { user?: any }) => {
    return req.user;
  }
}
