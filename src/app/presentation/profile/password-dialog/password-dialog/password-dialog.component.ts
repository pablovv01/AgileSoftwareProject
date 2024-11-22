import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ProfileUseCase } from '../../../../core/usecases/profile.usecase';

@Component({
  selector: 'app-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './password-dialog.component.html',
  styleUrl: './password-dialog.component.css'
})

  export class PasswordDialogComponent {
    passwordForm: FormGroup;
  
    constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<PasswordDialogComponent>,
      private profile: ProfileUseCase
    ) {
      
      this.passwordForm = this.fb.group({
        previousPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      }, {
        validators: this.passwordsMatch
      });
    }
  
    passwordsMatch(group: FormGroup): {[key: string]: boolean} | null {
      const newPassword = group.get('newPassword')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      return newPassword && confirmPassword && newPassword === confirmPassword ? null : { 'passwordMismatch': true };
    }
  
    changePassword() {
      if (this.passwordForm.valid) {
        try{
          this.profile.changePassword(this.passwordForm.get('previousPassword')?.value,this.passwordForm.get('newPassword')?.value)
        console.log('Password changed successfully!');
        Swal.fire({
          title: 'Password changed correctly',
          text: 'Password for this account has been changed successfully',
          icon: 'success',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        })
        }catch(error){
          Swal.fire({
            title: 'Whoops! Something went wrong',
            text: 'We couldn’t change the password. Please try again.',
            icon: 'error',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          })
        }
        this.dialogRef.close();
      } else {
        console.log('Form is invalid');
      }
    }
  
    // Función para cerrar el diálogo
    closeDialog() {
      this.dialogRef.close();
    }
  }  