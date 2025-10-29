import { Global, Module } from '@nestjs/common';
import { SuperadminConfigService } from './superadmin-config.service';

@Global() // <- Esto lo hace accesible en toda la app sin importar el módulo
@Module({
  providers: [SuperadminConfigService],
  exports: [SuperadminConfigService],
})
export class SuperadminModule {}
