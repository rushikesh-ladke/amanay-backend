import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.AMANAY_HOST,
      port: Number(process.env.AMANAY_PORT),
      username: process.env.AMANAY_USERNAME,
      password: process.env.AMANAY_PASSWORD,
      database: process.env.AMANAY_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    NotesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}