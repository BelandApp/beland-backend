import { ConflictException, Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UserAddressService } from '../user-address/user-address.service';
import { SuperadminConfigService } from '../superadmin-config/superadmin-config.service';

@Injectable()
export class DeliveryService {
  private readonly mapboxToken = process.env.MAPBOX_TOKEN;
  private readonly baseUrl = process.env.MAPBOX_URL;
  private readonly costBaseDelivery = 1.5;

  constructor(
    private readonly http: HttpService,
    private readonly userAddressService: UserAddressService,
    private readonly superadminConfigService: SuperadminConfigService,
  ) {}

  async getRouteData(
    driver: { lat: number; lon: number },
    customer: { lat: number; lon: number }
  ) {
    const url = `${this.baseUrl}/${driver.lon},${driver.lat};${customer.lon},${customer.lat}`;

    const params = {
      geometries: 'geojson',
      overview: 'simplified',
      access_token: this.mapboxToken,
    };

    const response = await firstValueFrom(
      this.http.get(url, { params })
    );

    const route = response.data.routes?.[0];
    if (!route) {
      throw new Error('No se pudo obtener la ruta desde Mapbox');
    }

    const distanceKm = route.distance / 1000; // metros → km
    const durationMin = route.duration / 60;   // segundos → minutos

    return {
      distanceKm: Number(distanceKm.toFixed(2)),
      durationMin: Number(durationMin.toFixed(2)),
    };
  }

  calculateDeliveryPrice (distanceKm: number): number {
    console.log("esta es la distancia Calculada en km: ", distanceKm)

    if (distanceKm <= 3) return this.costBaseDelivery;

    if (distanceKm <= 5) {
      const extra = distanceKm - 3;
      return this.costBaseDelivery + extra * 0.40;
    }

    if (distanceKm <= 10) {
      const tier1 = this.costBaseDelivery + (5 - 3) * 0.40; // hasta 5 km
      const extra = distanceKm - 5;
      return tier1 + extra * 0.30;
    }

    const tier1 = this.costBaseDelivery + (5 - 3) * 0.40;
    const tier2 = (10 - 5) * 0.30;
    const extra = distanceKm - 10;

    return tier1 + tier2 + extra * 0.20;
  }

  async getDeliveryInfo(
    driver: { lat: number; lon: number },
    customer: { lat: number; lon: number }
  ) {
    const { distanceKm, durationMin } = await this.getRouteData(driver, customer);

    const cost = this.calculateDeliveryPrice(distanceKm);

    console.log('Este es el costo del delivery: ', cost)

    return {
      distanceKm,
      durationMin,
      cost: Number(cost.toFixed(2)),
    };
  }

  async calculateFinalDeliveryForAddress(customerAddressId: string): Promise<{ distanceKm: number, durationMin: number, cost: number }> {
    const customerAddress = await this.userAddressService.findOne(customerAddressId);
    if (!customerAddress || !customerAddress.latitude || !customerAddress.longitude) {
      throw new BadRequestException('La dirección de entrega no es válida o no tiene coordenadas');
    }

    const superadminId = this.superadminConfigService.getSuperadminId();
    if (!superadminId) {
      throw new InternalServerErrorException('No se ha configurado un SuperAdmin en el sistema');
    }

    const [superadminAddresses] = await this.userAddressService.findAll(superadminId, 1, 10);
    if (!superadminAddresses || superadminAddresses.length === 0) {
      throw new InternalServerErrorException('El SuperAdmin no tiene una dirección configurada');
    }

    const originAddress = superadminAddresses.find(a => a.isDefault === true);
    if (!originAddress) {
      throw new InternalServerErrorException('El SuperAdmin no tiene configurada una dirección principal (isDefault) para envíos');
    }

    if (!originAddress.latitude || !originAddress.longitude) {
      throw new InternalServerErrorException('La dirección principal del SuperAdmin no tiene coordenadas configuradas');
    }

    return this.getDeliveryInfo(
      { lat: Number(originAddress.latitude), lon: Number(originAddress.longitude) },
      { lat: Number(customerAddress.latitude), lon: Number(customerAddress.longitude) }
    );
  }
}
