import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
console.log('ckmcknxcknxckl');
import { AppModule } from "./app.module"


async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  app.setGlobalPrefix(process.env.PREFIX)
  app.enableCors()
  await app.listen(process.env.PORT)
}
bootstrap()

console.log('dvjnvdsnvndsvknsdkvn');

console.log('nsjdnsnvlkdsnvkdsnv');