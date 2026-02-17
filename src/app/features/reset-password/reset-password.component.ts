import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/auth/services/authentication/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  errorMessage: WritableSignal<string> = signal<string>('');
  successMessage: WritableSignal<string> = signal<string>('');
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  showPassword: boolean = false;

  resetPasswordForm!: FormGroup;

  ngOnInit(): void {
    this.resetPasswordFormInitialization();
    this.checkEmailExists();
  }

  checkEmailExists(): void {
    const email = sessionStorage.getItem('resetEmail');
    if (!email) {
      this.router.navigate(['/forgot-password']);
    } else {
      this.resetPasswordForm.patchValue({ email });
    }
  }

  resetPasswordFormInitialization(): void {
    this.resetPasswordForm = this.fb.group({
      email: [
        { value: '', disabled: false }, 
        [Validators.required, Validators.email]
      ],
      newPassword: [
        null, 
        [
          Validators.required, 
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/)
        ]
      ],
    });
  }

  submitResetPasswordForm(): void {
    if (this.resetPasswordForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');

      // Get the raw value to include disabled fields
      const formData = {
        email: this.resetPasswordForm.get('email')?.value,
        newPassword: this.resetPasswordForm.get('newPassword')?.value
      };

      this.authService.resetPassword(formData).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.successMessage.set('Password reset successfully! Redirecting to login...');
          
          // Clear session storage
          sessionStorage.removeItem('resetEmail');
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.isLoading.set(false);
          this.errorMessage.set(err.error.message || 'Failed to reset password. Please try again.');
        },
      });
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }

  togglePasswordType(): void {
    this.showPassword = !this.showPassword;
  }
}