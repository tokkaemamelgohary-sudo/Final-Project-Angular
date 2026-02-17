import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderResponse } from '../models/orders.interface';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  
  private readonly httpClient = inject(HttpClient);

  /**
    @param userId - User ID from JWT token
    @returns Observable of OrderResponse
   * 
   * API: GET https://ecommerce.routemisr.com/api/v1/orders/user/{userId}
   */
  getUserOrders(userId: string): Observable<OrderResponse> {
    return this.httpClient.get<OrderResponse>(
      `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`
    );
  }

  /**
   * Get all orders (Admin only)
   * @returns Observable of OrderResponse
   * 
   * API: GET https://ecommerce.routemisr.com/api/v1/orders/
   */
  getAllOrders(): Observable<OrderResponse> {
    return this.httpClient.get<OrderResponse>(
      'https://ecommerce.routemisr.com/api/v1/orders/'
    );
  }

  /**
   * Create cash order from cart (Cash on Delivery)
   * @param cartId - Cart ID
   * @param shippingAddress - Shipping address object
   * @returns Observable of order creation response
   * 
   * API: POST https://ecommerce.routemisr.com/api/v2/orders/{cartId}
   */
  createCashOrder(cartId: string, shippingAddress: any): Observable<any> {
    return this.httpClient.post(
      `https://ecommerce.routemisr.com/api/v2/orders/${cartId}`,
      { shippingAddress }
    );
  }
}