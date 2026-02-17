import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../services/authentication/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { STORED_KEYS } from '../../constants/storedKeys';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);


  errorMessage: WritableSignal<string> = signal<string>('');

  isLoading: WritableSignal<boolean> = signal<boolean>(false);

  flag: boolean = true;

  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginFormInitialization();
  }

  loginFormInitialization(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/)]],
    });
  }


  submitLoginForm(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true)
      this.authService.sendLoginData(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            this.isLoading.set(false);
            this.loginForm.reset();

            localStorage.setItem(STORED_KEYS.userToken, res.token)

            this.authService.decodeUserToken()

            this.errorMessage.set('')
            setTimeout(() => {
              this.router.navigate(['/home'])
            }, 1000);
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.isLoading.set(false);

          this.errorMessage.set(err.error.message);
        },
      });
    }
  }

  togglePasswordType(): void {
    this.flag = !this.flag
  }

}