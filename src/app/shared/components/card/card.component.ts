import { Component, computed, inject, Input, Signal } from '@angular/core';
import { Product } from '../../../core/services/products/product.interface';
import { RouterLink } from "@angular/router";
import { CurrencyPipe } from '@angular/common';
import { SplitPipe } from '../../pipes/split-pipe';
import { CartService } from '../../../features/cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';

@Component({
  selector: 'app-card',
  imports: [RouterLink, CurrencyPipe, SplitPipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() cardProduct: Product = {} as Product;

  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly wishlistService = inject(WishlistService);

  // UPDATED: Use computed signal for reactive wishlist state
  isInWishlist: Signal<boolean> = computed(() => 
    this.wishlistService.isProductInWishlist(this.cardProduct.id)
  );

  addProductItemToCart(id: string): void {
    this.cartService.addProductToCart(id).subscribe({
      next: (res) => {
        this.cartService.cartCount.set(res.numOfCartItems);
        this.toastrService.success(res.message || 'Product added!', 'Freshcart');
      },
      error: (err) => {
        console.log(err);
        this.toastrService.error('Failed to add product!', 'Freshcart');
      },
    });
  }

  // UPDATED: Toggle wishlist - add if not present, remove if already there
  addProductItemToWishlist(id: string): void {
    const isCurrentlyInWishlist = this.wishlistService.isProductInWishlist(id);

    if (isCurrentlyInWishlist) {
      // Remove from wishlist
      this.wishlistService.removeProductFromWishlist(id).subscribe({
        next: (res) => {
          this.toastrService.warning('Removed from wishlist!', 'Freshcart');
        },
        error: (err) => {
          console.log(err);
          this.toastrService.error('Failed to remove from wishlist!', 'Freshcart');
        }
      });
    } else {
      // Add to wishlist
      this.wishlistService.addProductToWishlist(id).subscribe({
        next: (res) => {
          this.toastrService.success(res.message || 'Product added!', 'Freshcart');
        },
        error: (err) => {
          console.log(err);
          this.toastrService.error('Failed to add to wishlist!', 'Freshcart');
        }
      });
    }
  }
}