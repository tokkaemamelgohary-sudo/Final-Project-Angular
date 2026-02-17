import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/auth/services/authentication/auth.service';

@Component({
  selector: 'app-verify-reset-code',
  imports: [ReactiveFormsModule],
  templateUrl: './verify-reset.component.html',
  styleUrl: './verify-reset.component.css',
})
export class VerifyResetCodeComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  errorMessage: WritableSignal<string> = signal<string>('');
  successMessage: WritableSignal<string> = signal<string>('');
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  userEmail: WritableSignal<string> = signal<string>('');

  verifyCodeForm!: FormGroup;

  ngOnInit(): void {
    this.verifyCodeFormInitialization();
    this.checkEmailExists();
  }

  checkEmailExists(): void {
    const email = sessionStorage.getItem('resetEmail');
    if (!email) {
      this.router.navigate(['/forgot-password']);
    } else {
      this.userEmail.set(email);
    }
  }

  verifyCodeFormInitialization(): void {
    this.verifyCodeForm = this.fb.group({
      resetCode: [null, [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  submitVerifyCodeForm(): void {
    if (this.verifyCodeForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');

      this.authService.verifyResetCode(this.verifyCodeForm.value).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          if (res.status === 'Success') {
            this.successMessage.set('Code verified successfully!');
            
            setTimeout(() => {
              this.router.navigate(['/reset-password']);
            }, 1000);
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.isLoading.set(false);
          this.errorMessage.set(err.error.message || 'Invalid or expired verification code. Please try again.');
        },
      });
    } else {
      this.verifyCodeForm.markAllAsTouched();
    }
  }

  resendCode(): void {
    const email = sessionStorage.getItem('resetEmail');
    if (email) {
      this.isLoading.set(true);
      this.authService.forgotPassword({ email }).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.successMessage.set('New verification code sent to your email!');
          this.errorMessage.set('');
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.errorMessage.set('Failed to resend code. Please try again.');
        },
      });
    }
  }
}