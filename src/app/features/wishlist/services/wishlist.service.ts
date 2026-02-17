import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { STORED_KEYS } from '../../../core/constants/storedKeys';
import { isPlatformBrowser } from '@angular/common';
import { WishdataResponse } from '../models/wishdata.interface';
import { WishlistDetailsResponse } from '../models/wishlist-details.interface';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {

  private httpClient = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  wishlistCount: WritableSignal<number> = signal<number>(0);
  
  // NEW: Track product IDs currently in wishlist
  wishlistProductIds: WritableSignal<Set<string>> = signal<Set<string>>(new Set());

  private getHeaders(): HttpHeaders {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem(STORED_KEYS.userToken) ?? '';
    }
    return new HttpHeaders({
      token: token
    });
  }

  // UPDATED: Add tap operator to update wishlistProductIds
  addProductToWishlist(id: string): Observable<WishdataResponse> {
    const payload = { productId: id };
    const headers = this.getHeaders();

    console.log('Adding to wishlist:', payload, 'Headers:', headers.keys(), headers.get('token'));

    return this.httpClient.post<WishdataResponse>(
      environment.base_url + 'wishlist',
      payload,
      { headers }
    ).pipe(
      tap(res => {
        if (res.status === 'success') {
          // Update the Set with all product IDs from the API response
          this.wishlistProductIds.set(new Set(res.data));
          this.wishlistCount.set(res.data.length);
        }
      })
    );
  }

  // UPDATED: Add tap operator to sync wishlistProductIds on load
  getLoggedUserWishlist(): Observable<WishlistDetailsResponse> {
    return this.httpClient.get<WishlistDetailsResponse>(
      environment.base_url + 'wishlist',
      { headers: this.getHeaders() }
    ).pipe(
      tap(res => {
        if (res.status === 'success') {
          // Extract all product IDs from the wishlist data
          const productIds = res.data.map(item => item._id);
          this.wishlistProductIds.set(new Set(productIds));
          this.wishlistCount.set(res.data.length);
        }
      })
    );
  }

  // UPDATED: Remove product ID from the Set when deleted
  removeProductFromWishlist(id: string): Observable<WishlistDetailsResponse> {
    return this.httpClient.delete<WishlistDetailsResponse>(
      environment.base_url + `wishlist/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(res => {
        if (res.status === 'success') {
          // Remove the deleted product ID from the Set
          const updatedIds = new Set(this.wishlistProductIds());
          updatedIds.delete(id);
          this.wishlistProductIds.set(updatedIds);
          this.wishlistCount.set(res.data.length);
        }
      })
    );
  }

  // UPDATED: Clear all product IDs when wishlist is cleared
  clearWishlist(): Observable<any> {
    return this.httpClient.delete(
      environment.base_url + 'wishlist',
      { headers: this.getHeaders() }
    ).pipe(
      tap(() => {
        // Clear the Set completely
        this.wishlistProductIds.set(new Set());
        this.wishlistCount.set(0);
      })
    );
  }

  // NEW: Helper method to check if a product is in the wishlist
  isProductInWishlist(productId: string): boolean {
    return this.wishlistProductIds().has(productId);
  }
}