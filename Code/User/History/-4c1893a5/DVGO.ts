import { MailerModule } from "@nestjs-modules/mailer"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { AuthModule } from "src/auth"
import { dataSourceOptions, mailerConfig } from "src/config"
import { DomainModule } from "src/domain"
import { FeaturesModule } from "src/features"
import { TemplateModule } from "src/template"
import { UserModule } from "src/user"

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    MailerModule.forRootAsync(mailerConfig),
    UserModule,
    AuthModule,
    TemplateModule,
    FeaturesModule,
    DomainModule,
  ],
})

export class AppModule { }

Comment from https://github.
