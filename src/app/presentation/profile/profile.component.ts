import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
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
  userOld!: User;
  isEditingName: boolean = false;
  isEditingSurname: boolean = false;
  isEditingEmail: boolean = false;

  constructor(private dialog: MatDialog, private profile: ProfileUseCase) { }

  async ngOnInit() {
    // This is a temporal solution prepared for presentation Sprint 2 - Part 1
    const retrievedSessionObject = sessionStorage.getItem('user');
    if (retrievedSessionObject) {
      const userData = JSON.parse(retrievedSessionObject)
      const uid = userData.uid;
      const email = userData.email;
      this.user = await this.profile.loadUserInfo(email, uid)
      this.userOld = this.user
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

  showSaveMessage(){
    Swal.fire({
      title: 'Save profile changes',
      text: 'Are you sure you want to save the changes to your profile?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        if(this.userOld.name!=this.user.name){
          this.profile.updateName(this.user.name)
        }
        if(this.userOld.surname!=this.user.surname){
          this.profile.updateSurname(this.user.surname)
        }
        if(this.userOld.email!=this.user.email){
          this.profile.updateEmail(this.user.email)
        }
        if(this.userOld.photo!=this.user.photo){
          this.profile.updatePhoto(this.user.photo)
        }
      }
    });
  }

  changePhoto(){
    this.dialog.open(UploadPhotoComponent);
  }
}
