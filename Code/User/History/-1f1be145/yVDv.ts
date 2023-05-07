import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"

require("dotenv").config()


async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  app.setGlobalPrefix(process.env.PREFIX)
  app.enableCors()
  await app.listen(process.env.PORT)
}
bootstrap()

