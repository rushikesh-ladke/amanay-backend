import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { NoteAccessModule } from './note-access/note-access.module';
import { QuestionsModule } from './questions/questions.module';
import { RecurringTasksModule } from './recurring-tasks/recurring-tasks.module';
import { TaskSOPModule } from './task-sop/task-sop.module';
import { TasksModule } from './tasks/tasks.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.AMANAY_HOST,
      port: Number(process.env.AMANAY_PORT),
      username: process.env.AMANAY_USERNAME,
      password: process.env.AMANAY_PASSWORD,
      database: process.env.AMANAY_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: {
        rejectUnauthorized: true,
        ca: process.env.CA_CERTIFICATE,
    },
    }),
    UserModule,
    AuthModule,
    NotesModule,
    NoteAccessModule,
    QuestionsModule,
    RecurringTasksModule,
    TaskSOPModule,
    TasksModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}