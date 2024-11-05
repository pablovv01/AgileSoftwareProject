import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';



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
    MatSnackBarModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  registroForm: FormGroup;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.registroForm = this.fb.group({
      name: ["", [Validators.required]],
      type:["", [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onRegister() {
    const auth = getAuth();
    if (this.registroForm.valid) {
      const { email, password } = this.registroForm.value;
      createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          console.log("Usuario registered:", userCredential);
          this.snackBar.open('User registered successfully', 'Cerrar', {
            duration: 3000, 
            verticalPosition: 'bottom', 
            horizontalPosition: 'center'
          });
        })
        .catch(error => {
          console.error("Error en el registro:", error);
          this.snackBar.open('There has been an error: '+error, 'Cerrar', {
            duration: 3000, 
            verticalPosition: 'bottom', 
            horizontalPosition: 'center'
          });
        });
    }
  }
}
