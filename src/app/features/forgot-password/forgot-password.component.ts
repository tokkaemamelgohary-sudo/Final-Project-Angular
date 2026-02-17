import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/auth/services/authentication/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  errorMessage: WritableSignal<string> = signal<string>('');
  successMessage: WritableSignal<string> = signal<string>('');
  isLoading: WritableSignal<boolean> = signal<boolean>(false);

  forgotPasswordForm!: FormGroup;

  ngOnInit(): void {
    this.forgotPasswordFormInitialization();
  }

  forgotPasswordFormInitialization(): void {
    this.forgotPasswordForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  submitForgotPasswordForm(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');

      this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          if (res.statusMsg === 'success') {
            this.successMessage.set('Verification code sent to your email successfully!');
            
            sessionStorage.setItem('resetEmail', this.forgotPasswordForm.value.email);
            
            setTimeout(() => {
              this.router.navigate(['/verify-reset-code']);
            }, 1500);
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.isLoading.set(false);
          this.errorMessage.set(err.error.message || 'Failed to send verification code. Please try again.');
        },
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }
}