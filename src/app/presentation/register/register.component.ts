import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LayoutModule } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Centers } from '../../core/entities/centers';
import { RegisterUseCase } from '../../core/usecases/register.usecase';
import { User } from '../../core/entities/user';
import Swal from 'sweetalert2';


import { allowedEmailDomainValidator } from '../../utils/email-domain.validator';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormField,
    MatLabel,
    MatError,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    LayoutModule,
    MatIcon
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registrationForm: FormGroup;
  centers = Object.values(Centers);
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private registerUseCase: RegisterUseCase
  ) {
    this.registrationForm = this.fb.group({
      name: ["", [Validators.required]],
      surname: ["", [Validators.required]],
      type: ["", [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      center: [''],
      degree: [''],
      company: [''],
      position: [''],
      description: ['']
    }, { validators: this.passwordsMatchValidator } 
  );
}

  togglePasswordVisibility(event: Event): void {
    event.preventDefault();
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(event: Event): void {
    event.preventDefault();
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  onTypeChange(type: string): void {
    const centerControl = this.registrationForm.get('center');
    const degreeControl = this.registrationForm.get('degree');
    const companyControl = this.registrationForm.get('company');
    const positionControl = this.registrationForm.get('position');
    const descriptionControl = this.registrationForm.get('description');
    const emailControl = this.registrationForm.get('email');

    if (type === 'student') {
      centerControl?.setValidators(Validators.required);
      degreeControl?.setValidators(Validators.required);
      emailControl?.setValidators([
        Validators.required,
        Validators.email,
        allowedEmailDomainValidator(['upm.es', 'alumnos.upm.es'])
      ]);
      companyControl?.clearValidators();
      positionControl?.clearValidators();
      descriptionControl?.clearValidators();
    } else {
      centerControl?.clearValidators();
      degreeControl?.clearValidators();
      companyControl?.setValidators(Validators.required);
      positionControl?.setValidators(Validators.required);
      descriptionControl?.setValidators(Validators.required);
      emailControl?.setValidators([
        Validators.required,
       Validators.email
      ]);
    }
    centerControl?.updateValueAndValidity();
    degreeControl?.updateValueAndValidity();
    companyControl?.updateValueAndValidity();
    positionControl?.updateValueAndValidity();
    descriptionControl?.updateValueAndValidity();
    emailControl?.updateValueAndValidity();
  }

  

  // Function to check if the password and confirm password fields match
  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      form.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }

  onRegister() {
    if (this.registrationForm.valid) {
      const { name, surname, email, password, type, center, degree, company, position, description } = this.registrationForm.value;
      const user = new User(name, surname, email, type, '',center, degree, company, position, description);

      this.registerUseCase.registerUser(user, password)
        .then(() => {
          Swal.fire({
            title: 'Almost there!',
            text: 'A verification email has been sent. Please check your inbox to verify your account.',
            icon: 'success',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
              // Navigate login after click on ok.
              this.router.navigate(['/login']);
            }
          });
        })
        .catch(error => {
          console.error("Error en el registro:", error);
          if (error.code === 'auth/email-already-in-use') {
            this.registrationForm.get('email')?.setErrors({ emailInUse: true });
            //this.snackBar.open('This email is already in use.', 'Close', { duration: 8000, panelClass: 'custom-snackbar' });
            Swal.fire({
              title: 'Whoops! Something went wrong',
              text: 'The email address provided is already associated with an account. Please try another one or reset your password.',
              icon: 'warning',
              confirmButtonText: 'Ok',
              allowOutsideClick: false
            })
          } else {
            Swal.fire({
              title: 'Registration error',
              text: 'Something went wrong. Please try again.',
              icon: 'error',
              confirmButtonText: 'Ok',
              allowOutsideClick: false
            })
          }
        });
    }
  }
}