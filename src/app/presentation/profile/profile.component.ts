import { ɵBrowserAnimationBuilder } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { User } from '../../core/entities/user';
import Swal from 'sweetalert2';
import { PasswordDialogComponent } from './password-dialog/password-dialog/password-dialog.component';
import { UploadPhotoComponent } from './upload-photo/upload-photo/upload-photo.component';
import { ProfileUseCase } from '../../core/usecases/profile.usecase';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  showPasswordSection: boolean = false;
  userImage: string = 'assets/userProfile_img.png';
  user!: User;
  isEditingName: boolean = false;
  isEditingSurname: boolean = false;
  isEditingEmail: boolean = false;

  constructor(private dialog: MatDialog, private profile: ProfileUseCase) { }

  togglePasswordSection() {
    this.showPasswordSection = !this.showPasswordSection;
  }

  async ngOnInit() {
    // This is a temporal solution prepared for presentation Sprint 2 - Part 1 
    const retrievedSessionObject = sessionStorage.getItem('user');
    if (retrievedSessionObject) {
      const userData = JSON.parse(retrievedSessionObject)
      const uid = userData.uid;
      const email = userData.email;
      this.user = await this.profile.loadUserInfo(email, uid)
    } else {
      console.log('No se encontraron datos en sessionStorage.');
    }
  }


  openPasswordDialog() {
    this.dialog.open(PasswordDialogComponent, {
      width: '400px',
    });
  }

  toggleEditName() {
    this.isEditingName = !this.isEditingName;
  }

  toggleEditSurname() {
    this.isEditingSurname = !this.isEditingSurname;
  }

  toggleEditEmail() {
    this.isEditingEmail = !this.isEditingEmail;
  }

  //TODO To implement
  saveChanges() {
    console.log('Cambios guardados:', this.user);
    Swal.fire({
      title: 'Under construction',
      text: 'Saving data is under construction',
      icon: 'info',
      confirmButtonText: 'Okay!',
      allowOutsideClick: false
    })
  }

  changePhoto(){
    this.dialog.open(UploadPhotoComponent);
  }
}
