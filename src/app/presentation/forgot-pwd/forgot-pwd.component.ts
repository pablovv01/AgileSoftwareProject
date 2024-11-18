import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LayoutModule } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { FirebaseAuthService } from '../../data/firebase_auth_service';
import { LoginUseCase } from '../../core/usecases/login.usecase';

@Component({
  selector: 'app-forgot-pwd',
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
  templateUrl: './forgot-pwd.component.html',
  styleUrl: './forgot-pwd.component.css'
})
export class ForgotPwdComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router, private loginUseCase: LoginUseCase) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onResetPassword() {
    // Verify valid form
    if (this.loginForm.valid) {
      const { email } = this.loginForm.value;
      this.loginUseCase.resetPassword(email)
        .then(() => {
          Swal.fire({
            title: 'Reset Password',
            text: 'Password reset email sent. Please check your inbox.',
            icon: 'success',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/login']);
            }
          });
        })
        .catch(error => {
          Swal.fire({
            title: 'Reset Password',
            text: 'Please enter a valid email address.',
            icon: 'error',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          });
        });
    } else {
      this.snackBar.open('Please enter a valid email address.', 'Close', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      });
    }
  }
}