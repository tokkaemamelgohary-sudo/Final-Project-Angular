import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { WishlistService } from './services/wishlist.service';
import { WishlistDetails } from './models/wishlist-details.interface';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../cart/services/cart.service';

@Component({
  selector: 'app-wishlist',
  imports: [CurrencyPipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly toastr = inject(ToastrService);

  wishlistDetailsData: WritableSignal<WishlistDetails[]> = signal<WishlistDetails[]>([]);

  ngOnInit(): void {
    this.getUserWishlistData();
  }

  getUserWishlistData(): void {
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.wishlistDetailsData.set(res.data);
          // The tap operator in the service already updates wishlistProductIds
        }
      },
      error: (err) => console.log(err)
    });
  }

  addToWishlist(productId: string) {
    console.log('Trying to add product to wishlist:', productId);
    this.wishlistService.addProductToWishlist(productId).subscribe({
      next: (res) => {
        console.log('Wishlist response:', res);
        if (res.status === 'success') {
          this.toastr.success('Product added to wishlist!');
          this.getUserWishlistData();
        }
      },
      error: (err) => {
        console.error('Wishlist error:', err);
        this.toastr.error('Failed to add product!');
      }
    });
  }

  addProductToCart(productId: string): void {
    this.cartService.addProductToCart(productId).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastr.success('Product added to cart!', 'Freshcart');

          // Remove from wishlist (tap operator will update wishlistProductIds)
          this.wishlistService.removeProductFromWishlist(productId).subscribe({
            next: (deleteRes) => {
              if (deleteRes.status === 'success') {
                this.wishlistDetailsData.update(current =>
                  current.filter(item => item._id !== productId)
                );
                this.toastr.warning('Removed from wishlist', 'Freshcart');
              }
            },
            error: (err) => console.log(err)
          });
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Failed to add product to cart', 'Freshcart');
      }
    });
  }

  removeProductItemFromWishlist(id: string): void {
    this.wishlistService.removeProductFromWishlist(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          // The tap operator in service already updates wishlistProductIds and count
          this.wishlistDetailsData.update(current =>
            current.filter(item => item._id !== id)
          );
          this.toastr.success('Product removed from wishlist!', 'Freshcart');
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Failed to remove product!', 'Freshcart');
      }
    });
  }

  clearWishlist(): void {
    this.wishlistService.clearWishlist().subscribe({
      next: (res) => {
        // The tap operator in service already clears wishlistProductIds and count
        this.wishlistDetailsData.set([]);
        console.log('Wishlist cleared on server');
        this.toastr.warning('Wishlist cleared!', 'Freshcart');
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Failed to clear wishlist', 'Freshcart');
      }
    });
  }
}