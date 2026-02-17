import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CartDataResponse } from '../models/cart-data.interface';
import { CartDetailsResponse } from '../models/cart-details.interface';
import { OrderDetailsResponse } from '../models/order-details.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private readonly httpClient = inject(HttpClient);

  cartCount: WritableSignal<number> = signal<number>(0);

  addProductToCart(id: string): Observable<CartDataResponse> {
    return this.httpClient.post<CartDataResponse>(
      'https://ecommerce.routemisr.com/api/v2/cart',
      {
        productId: id,
      }
    );
  }

  getLoggedUserCart(): Observable<CartDetailsResponse> {
    return this.httpClient.get<CartDetailsResponse>(
      'https://ecommerce.routemisr.com/api/v2/cart'
    );
  }

  removeProductFromCart(id: string): Observable<CartDetailsResponse> {
    return this.httpClient.delete<CartDetailsResponse>(
      `https://ecommerce.routemisr.com/api/v2/cart/${id}`
    );
  }

  updateCartProductQuantity(id: string, count: number): Observable<CartDetailsResponse> {
    return this.httpClient.put<CartDetailsResponse>(
      `https://ecommerce.routemisr.com/api/v2/cart/${id}`,
      { count: count }
    );
  }

  checkoutSession(cartId: string | null, checkoutData: object): Observable<OrderDetailsResponse> {
    // ✅ FIXED: Dynamic URL using window.location.origin instead of hard-coded localhost
    const returnUrl = window.location.origin;
    
    return this.httpClient.post<OrderDetailsResponse>(
      `${environment.base_url}orders/checkout-session/${cartId}?url=${encodeURIComponent(returnUrl)}`,
      checkoutData
    );
  }

  clearCart(): Observable<any> {
    return this.httpClient.delete(environment.base_url + 'cart');
  }
}