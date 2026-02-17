import { CommonModule, CurrencyPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { STORED_KEYS } from '../../core/constants/storedKeys';
import { Order } from './models/orders.interface';
import { OrdersService } from './services/orders.service';

interface DecodedToken {
  id: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}

@Component({
  selector: 'app-all-orders',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, NgClass],
   templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.css',
})
export class AllOrdersComponent implements OnInit {
  
  private readonly ordersService = inject(OrdersService);
  private readonly toastr = inject(ToastrService);

  ordersData: WritableSignal<Order[]> = signal<Order[]>([]);
  isLoading: WritableSignal<boolean> = signal<boolean>(true);

  ngOnInit(): void {
    this.getUserOrders();
  }

  getUserOrders(): void {
    this.isLoading.set(true);

    const token = localStorage.getItem(STORED_KEYS.userToken);
    
    if (!token) {
      this.toastr.error('Please login first');
      this.isLoading.set(false);
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.id;

      this.ordersService.getUserOrders(userId).subscribe({
        next: (response) => {
          this.ordersData.set(response.data || response);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching orders:', err);
          this.toastr.error('Failed to load orders');
          this.isLoading.set(false);
        }
      });
    } catch (error) {
      console.error('Error decoding token:', error);
      this.toastr.error('Invalid token');
      this.isLoading.set(false);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getPaymentIcon(paymentMethod: string): string {
    return paymentMethod.toLowerCase() === 'cash' 
      ? 'fas fa-money-bill-wave' 
      : 'fas fa-credit-card';
  }

  getStatusClasses(isPaid: boolean, isDelivered: boolean): string {
    if (isDelivered) return 'bg-green-100 text-green-700';
    if (isPaid) return 'bg-blue-100 text-blue-700';
    return 'bg-yellow-100 text-yellow-700';
  }

  getStatusText(isPaid: boolean, isDelivered: boolean): string {
    if (isDelivered) return 'Delivered';
    if (isPaid) return 'Processing';
    return 'Pending';
  }


clearAllOrders(): void {
  this.ordersData.set([]);
  this.toastr.success('All orders cleared from view');
}

}