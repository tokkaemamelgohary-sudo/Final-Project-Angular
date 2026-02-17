import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from '../allorders/services/orders.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly ordersService = inject(OrdersService);

  cartId: string | null = null;
  checkoutForm!: FormGroup;

  ngOnInit(): void {
    this.checkoutFormInitialization();
    this.getCartId();
  }

  checkoutFormInitialization(): void {
    this.checkoutForm = this.fb.group({
      shippingAddress: this.fb.group({
        details: [null, [Validators.required]],
        phone: [null, [Validators.required, Validators.pattern(/^(\\+20|0|0020)?[1][0-2,5][0-9]{8}$/)]],
        city: [null, [Validators.required]],
      }),
    });
  }

  getCartId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (urlParms) => {
        this.cartId = urlParms.get('id');
      }
    });
  }

  onSubmitCheckoutForm(): void {
    if (this.checkoutForm.valid) {
      this.cartService.checkoutSession(this.cartId, this.checkoutForm.value).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            window.open(res.session.url, '_self');
          }
        },
        error: (err) => {
          console.error('Payment error:', err);
          this.toastr.error('Payment failed. Please try again.');
        },
      });
    } else {
      this.toastr.error('Please fill all required fields!');
    }
  }

  payWithCash(): void {
    if (this.checkoutForm.valid && this.cartId) {
      
      this.ordersService.createCashOrder(this.cartId, this.checkoutForm.value.shippingAddress).subscribe({
        next: (res) => {
          this.toastr.success('Order placed successfully! Pay on delivery.');
          
          this.cartService.cartCount.set(0);
          
          setTimeout(() => {
            this.router.navigate(['/allorders']);
          }, 1000);
        },
        error: (err) => {
          console.error('Error creating cash order:', err);
          this.toastr.error('Failed to place order. Please try again.');
        }
      });
    } else {
      this.toastr.error('Please fill all required fields!');
    }
  }
}