import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { LayoutModule } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Centers } from '../../core/entities/centers';
import { RegisterUseCase } from '../../core/usecases/register.usecase';
import { User } from '../../core/entities/user';

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
  centers = Object.values(Centers);

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private registerUseCase: RegisterUseCase
  ) {
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
    if (this.registrationForm.valid) {
      const {name, surname, email, password, type, center, degree, company, position, description} = this.registrationForm.value;
      const user = new User(name, surname, email, type, center, degree, company, position, description);

      this.registerUseCase.registerUser(user, password)
        .then(() => {
          this.snackBar.open('Verification email sent successfully. Please check your inbox.', 'Close', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
          }).afterDismissed().subscribe(() => {
            this.router.navigate(['/login']);
          });
        })
        .catch(error => {
          console.error("Error en el registro:", error);
          this.snackBar.open(error.message, 'Close', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
          });
        });
    }
  }
}