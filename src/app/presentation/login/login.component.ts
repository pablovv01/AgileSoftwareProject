import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel, MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LayoutModule } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
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
    LayoutModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onLogin() {
    const auth = getAuth();
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          if (userCredential.user.emailVerified) {
            this.router.navigate(['/home']);
            sessionStorage.setItem('userId', userCredential.user.uid); //Store User ID in session storage
            //console.log(userCredential.user)
          } else {
            Swal.fire({
              title: 'You’re so close!',
              text: 'You need to validate your email to complete the sign-in process. Check your inbox!',
              icon: 'warning',
              confirmButtonText: 'Okay!',
              allowOutsideClick: false
            })
          }
        })
        .catch(error => {
          Swal.fire({
            title: 'Whoops! Something went wrong',
            text: 'We couldn’t sign you in. Please verify your credentials and try again.',
            icon: 'error',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          })
        });
    }
  }
}
