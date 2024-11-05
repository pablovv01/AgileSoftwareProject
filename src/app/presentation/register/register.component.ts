import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';



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
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  registroForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({
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
          console.log("Usuario registrado:", userCredential);
          // Aquí puedes redirigir o mostrar un mensaje de éxito
        })
        .catch(error => {
          console.error("Error en el registro:", error);
          // Puedes manejar el error mostrando un mensaje al usuario
        });
    }
  }
}
