import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DeliveryService {
  private readonly mapboxToken = process.env.MAPBOX_TOKEN;
  private readonly baseUrl = process.env.MAPBOX_URL;

  constructor(private readonly http: HttpService) {}

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
    if (distanceKm <= 3) return 2.5;

    if (distanceKm <= 5) {
      const extra = distanceKm - 3;
      return 2.5 + extra * 0.40;
    }

    if (distanceKm <= 10) {
      const tier1 = 2.5 + (5 - 3) * 0.40; // hasta 5 km
      const extra = distanceKm - 5;
      return tier1 + extra * 0.30;
    }

    const tier1 = 2.5 + (5 - 3) * 0.40;
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

    return {
      distanceKm,
      durationMin,
      cost: Number(cost.toFixed(2)),
    };
  }
}
