import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { LayoutModule } from '@angular/cdk/layout';



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
    LayoutModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  registrationForm: FormGroup;

  centers = [
    'Centro Superior de Diseño de Moda de Madrid',
    'Escuela Politécnica de Enseñanza Superior',
    'Escuela Técnica Superior de Arquitectura',
    'Escuela Técnica Superior de Ciencias de la Actividad Física y del Deporte (INEF)',
    'Escuela Técnica Superior de Edificación',
    'Escuela Técnica Superior de Ingeniería Agronómica, Alimentaria y de Biosistemas',
    'Escuela Técnica Superior de Ingeniería Aeronáutica y del Espacio',
    'Escuela Técnica Superior de Ingeniería de Montes, Forestal y del Medio Natural',
    'Escuela Técnica Superior de Ingeniería de Sistemas Informáticos',
    'Escuela Técnica Superior de Ingeniería y Diseño Industrial',
    'Escuela Técnica Superior de Ingeniería y Sistemas de Telecomunicación',
    'Escuela Técnica Superior de Ingenierios Navales',
    'Escuela Técnica Superior de Ingenieros de Caminos, Canales y Puertos',
    'Escuela Técnica Superior de Ingenieros de Minas y Energía',
    'Escuela Técnica Superior de Ingenieros de Telecomunicación',
    'Escuela Técnica Superior de Ingenieros en Topografía, Geodesia y Cartografía',
    'Escuela Técnica Superior de Ingenieros Industriales',
    'Escuela Técnica Superior de Ingenieros Informáticos',
    'Instituto de Ciencias de la Educación ICE'
];

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.registrationForm = this.fb.group({
      name: ["", [Validators.required]],
      surname: ["", [Validators.required]],
      type:["", [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      center:[''],
      degree:[''],
      company:[''],
      position:[''],
      description: ['']
    });
  }

  onTypeChange(type: string): void {
    const centerControl = this.registrationForm.get('center');
    const degreeControl = this.registrationForm.get('degree');
    const companyControl = this.registrationForm.get('company');
    const positionControl = this.registrationForm.get('position');
    const descriptionControl = this.registrationForm.get('description');


    if (type === 'student') {
      centerControl?.setValidators(Validators.required);
      degreeControl?.setValidators(Validators.required);
      companyControl?.clearValidators();
      positionControl?.clearValidators();
      descriptionControl?.clearValidators();
    } else {
      centerControl?.clearValidators();
      degreeControl?.clearValidators();
      companyControl?.setValidators(Validators.required);
      positionControl?.setValidators(Validators.required);
      descriptionControl?.setValidators(Validators.required);
    }
    centerControl?.updateValueAndValidity();
    degreeControl?.updateValueAndValidity();
    companyControl?.updateValueAndValidity();
    positionControl?.updateValueAndValidity();
    descriptionControl?.updateValueAndValidity();
  }

  onRegister() {
    const auth = getAuth();
    if (this.registrationForm.valid) {
      const { email, password } = this.registrationForm.value;
      createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          console.log("Usuario registered:", userCredential);
          sendEmailVerification(userCredential.user).then(() => {
            this.snackBar.open('Verification email sent successfully. Please check your inbox in order to activate your account. If it is not found check the SPAM folder', 'Close', {
              duration: 3000, 
              verticalPosition: 'bottom', 
              horizontalPosition: 'center'
            });
          }).catch((error) => {
            this.snackBar.open('Error sending verification email. Please try again', 'Close', {
              duration: 3000, 
              verticalPosition: 'bottom', 
              horizontalPosition: 'center'
            });
            console.error('Error sending verification email:', error);
          });          
        })
        .catch(error => {
          console.error("Error en el registro:", error);
          this.snackBar.open(error, 'Close', {
            duration: 3000, 
            verticalPosition: 'bottom', 
            horizontalPosition: 'center'
          });
        });
    }
  }
}
