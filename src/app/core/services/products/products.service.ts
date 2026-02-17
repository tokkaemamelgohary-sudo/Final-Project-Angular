import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsResponse } from './products-response.interface';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient);

  getAllProducts(page:number = 1 , limit:number = 10): Observable<ProductsResponse> {
    return this.httpClient.get<ProductsResponse>(environment.base_url + `products?page=${page}&limit=${limit}` );
  }
}
