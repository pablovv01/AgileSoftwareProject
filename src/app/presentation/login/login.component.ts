import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LayoutModule } from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
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
          } else {
            this.snackBar.open('Please, validate your email before signing in', 'Close', {
              duration: 3000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center'
            })
          }
        })
        .catch(error => {
          console.error("Sign in error: ", error);
          this.snackBar.open("Sign in error: "+ error.message, 'Close', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
          });
        });
    }
  }
}
