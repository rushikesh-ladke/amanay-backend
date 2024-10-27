import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // or 'postgres' or 'sqlite'
      host: process.env.HOST,
      port: Number(process.env.PORT),  // change based on your DB type
      username: process.env.USERNAME,  // your DB username
      password: process.env.PASSWORD,  // your DB password
      database: process.env.DATABASE,  // your DB name
      entities: [__dirname + '/**/*.entity{.ts,.js}'],  // auto-load entities
      synchronize: true,  // should be false in production
    }),
    UserModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
