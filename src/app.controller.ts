import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Controller()
export class AppController {
  private authClient: ClientProxy;
  private userClient: ClientProxy;

  constructor() {
    this.authClient = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: { host: 'redis', port: 6379 },
    });

    this.userClient = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: { host: 'redis', port: 6379 },
    });
  }

  // ====================== AUTH ======================

  @Post('auth/register')
  async register(
    @Body()
    body: {
      username: string;
      userEmail: string;
      userPassword: string;
      gender: string;
    },
  ) {
    // Forward to Auth Service → Auth Service will call USER_CREATE
    return this.authClient.send('AUTH_REGISTER', body);
  }

  @Post('auth/login')
  async login(@Body() body: { userEmail: string; userPassword: string }) {
    return this.authClient.send('AUTH_LOGIN', body);
  }

  // ====================== USER ======================

  @Post('users')
  async createUser(
    @Body()
    body: {
      username: string;
      userEmail: string;
      userPassword: string;
      gender: string;
    },
  ) {
    return this.userClient.send('USER_CREATE', body);
  }

  @Get('users/email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.userClient.send('USER_FIND_BY_EMAIL', { userEmail: email });
  }

  @Get('users/:id')
  async findById(@Param('id') id: string) {
    return this.userClient.send('USER_FIND_BY_ID', { id });
  }
}
