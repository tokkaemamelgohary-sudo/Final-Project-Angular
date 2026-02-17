import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuardGuard } from './core/guards/guest-guard-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./core/layouts/main-layout/main-layout.component').then(c => c.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent),
        title: 'Home'
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products/products.component').then(c => c.ProductsComponent),
        title: 'Products'
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/categories/categories.component').then(c => c.CategoriesComponent),
        title: 'Categories'
      },
      {
        path: 'brands',
        loadComponent: () => import('./features/brands/brands.component').then(c => c.BrandsComponent),
        title: 'Brands'
      },
      {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart.component').then(c => c.CartComponent),
        title: 'Cart'
      },
      {
        path: 'wishlist',
        loadComponent: () => import('./features/wishlist/wishlist.component').then(c => c.WishlistComponent),
        title: 'Wishlist'
      },
      {
        path: 'checkout/:id',
        loadComponent: () => import('./features/checkout/checkout.component').then(c => c.CheckoutComponent),
        title: 'Checkout'
      },
      {
        path: 'allorders',
        loadComponent: () => import('./features/allorders/allorders.component').then(c => c.AllOrdersComponent),
        title: 'Orders'
      },
      {
        path: 'details/:slug/:id',
        loadComponent: () => import('./features/details/details.component').then(c => c.DetailsComponent),
        title: 'Details'
      }
    ]
  },
  {
    path: '',
    loadComponent: () => import('./core/layouts/auth-layout/auth-layout.component').then(c => c.AuthLayoutComponent),
    canActivate: [guestGuardGuard],
    children: [
      {
        path: 'register',
        loadComponent: () => import('./core/auth/register/register.component').then(c => c.RegisterComponent),
        title: 'Register'
      },
      {
        path: 'login',
        loadComponent: () => import('./core/auth/login/login.component').then(c => c.LoginComponent),
        title: 'Login'
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent),
        title: 'Forgot Password'
      },
      {
        path: 'verify-reset-code',
        loadComponent: () => import('./features/verify-reset/verify-reset.component').then(c => c.VerifyResetCodeComponent),
        title: 'Verify Reset Code'
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./features/reset-password/reset-password.component').then(c => c.ResetPasswordComponent),
        title: 'Reset Password'
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./features/notfound/notfound.component').then(c => c.NotfoundComponent),
    title: 'Not Found'
  }
];