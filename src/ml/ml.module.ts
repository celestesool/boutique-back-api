import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MLService } from './ml.service';
import { MLResolver } from './ml.resolver';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
  ],
  providers: [MLService, MLResolver],
  exports: [MLService],
})
export class MLModule {}