"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    app.setGlobalPrefix('ideaFlow/api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: ['http://localhost:5173'],
        credentials: true,
    });
    const port = process.env.API_PORT || 3001;
    await app.listen(port);
    console.log(`🚀 IdeaFlow API running on http://localhost:${port}/ideaFlow/api/v1`);
}
bootstrap();
//# sourceMappingURL=main.js.map