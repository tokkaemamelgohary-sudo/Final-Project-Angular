import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/authentication/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);



  errorMessage: WritableSignal<string> = signal<string>('');

  isLoading: WritableSignal<boolean> = signal<boolean>(false);

  flag: boolean = true;

  registerForm!: FormGroup ;


ngOnInit(): void {
  this.registerFormInitialization();
}


 
   registerFormInitialization(): void {

this.registerForm=this.fb.group({
    name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],

    email: [null, [Validators.required, Validators.email]],

    password: [null, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/)]],

    rePassword: [null, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/)]],

    phone: [null, [Validators.required, Validators.pattern(/^(\\+20|0|0020)?[1][0-2,5][0-9]{8}$/)]],
  },
   { validators: this.handleConfirmPassword },

  );



    } 
  

  handleConfirmPassword(group: AbstractControl) {
    return group.get('password')?.value === group.get('rePassword')?.value
      ? null
      : { mismatch: true };

  }

  submitRegisterForm(): void {
    if (this.registerForm.valid) {
    } else {

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });

      this.showFristError();
    }
  }

  showFristError(): void {
    const controls = this.registerForm.controls;

    for (const controlName in controls) {

      const control = controls[controlName];


      if (control.invalid) {
        control.markAsTouched();
        break;



      }
    }
  }


  togglePasswordType(): void {
    this.flag = !this.flag
  }


}



//   this.isLoading.set(true)



// this.authService.sendRegisterData(this.registerForm.value).subscribe({
//   next: (res)=>{
// if(res.message === 'success'){
//     this.isLoading.set(false);
//     this.registerForm.reset();
//    this.errorMessage.set('')
//     setTimeout(() => {
//       this.router.navigate(['/login'])
//     }, 1000);
// }
//   },

//   error:(err:HttpErrorResponse)=>{
//     console.log(err);
//         this.isLoading.set(false);

//     this.errorMessage.set(err.error.message);
//   },
// });


// }