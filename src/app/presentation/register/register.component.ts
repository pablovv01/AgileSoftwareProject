import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { LayoutModule } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';



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

constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router) {
  this.registrationForm = this.fb.group({
    name: ["", [Validators.required]],
    surname: ["", [Validators.required]],
    type: ["", [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
    center: [''],
    degree: [''],
    company: [''],
    position: [''],
    description: ['']
  }, { validators: this.passwordsMatchValidator });
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
      const auth = getAuth();
      const { name, surname, email, password, type, center, degree, company, position, description } = this.registrationForm.value;
      createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          const db = getDatabase();
          set(ref(db, 'users/' + userCredential.user.uid), {
            name: name,
            surname: surname,
            type: type,
            center: center,
            degree: degree,
            company: company,
            position: position,
            description: description
          });
          sendEmailVerification(userCredential.user).then(() => {
            // this.snackBar.open('Verification email sent successfully.', 'Close', { duration: 8000 });
            // this.router.navigate(['/login']);
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
          });
        })
        .catch(error => {
          // Email already in use
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
          }else{
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