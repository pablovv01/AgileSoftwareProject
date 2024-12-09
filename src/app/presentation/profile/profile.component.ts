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
import { FileUtils } from '../../utils/FileUtils';
import { FormsModule } from '@angular/forms';
import { allowedEmailDomainValidator } from '../../utils/email-domain.validator';


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
    MatDialogModule,
    FormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  userImage: string = 'assets/userProfile_img.png';
  user!: User;
  userOld!: User;
  isEditingName: boolean = false;
  isEditingSurname: boolean = false;
  isEditingEmail: boolean = false;
  allowedDomains: string[] = ['alumnos.upm.es', 'upm.es'];

  constructor(private dialog: MatDialog, private profile: ProfileUseCase) { }

  async ngOnInit() {
    const retrievedSessionObject = sessionStorage.getItem('user');
    if (retrievedSessionObject) {
      const userData = JSON.parse(retrievedSessionObject)
      const uid = userData.uid;
      const email = userData.email;
      this.user = await this.profile.loadUserInfo(email, uid)
      if (this.user.photo != null && this.user.photo != '') {
        this.userImage = this.user.photo
      }
      this.userOld = JSON.parse(JSON.stringify(this.user));
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

  showSaveMessage() {
    Swal.fire({
      title: 'Save profile changes',
      text: 'Are you sure you want to save the changes to your profile?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
      allowOutsideClick: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (this.user.photo != this.userOld.photo || this.user.name != this.userOld.name || this.user.surname != this.userOld.surname) {
          await this.profile.updateProfile(this.user)
          this.userOld = Object.assign({}, this.user);
          Swal.fire({
            title: 'Profile Updated Successfully!',
            text: 'Your profile has been updated successfully',
            icon: 'success',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          })
        } else if (this.user.email !== this.userOld.email) {
          if (this.user.type === "student") {
            if (!this.isAllowedEmailDomain(this.user.email)) {
              Swal.fire({
                title: 'Invalid Email Domain!',
                text: 'Please use an email with a domain @alumnos.upm.es or @upm.es',
                icon: 'error',
                confirmButtonText: 'Ok',
                allowOutsideClick: false
              });
              return;
            }
          }
          try {
            await this.profile.updateEmail(this.user);
            this.userOld = Object.assign({}, this.user);
            Swal.fire({
              title: 'Email Updated Successfully!',
              text: 'Your email has been updated successfully',
              icon: 'success',
              confirmButtonText: 'Ok',
              allowOutsideClick: false
            });

          } catch (error: any) {
            Swal.fire({
              title: 'Email could not be updated!',
              text: error.message || 'There has been an error updating your email.',
              icon: 'error',
              confirmButtonText: 'Ok',
              allowOutsideClick: false
            });
          }
        } else {
          Swal.fire({
            title: 'No Changes Detected',
            text: 'The details are the same as the current ones.',
            icon: 'info',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
          });
        }
      }
    });
  }

  changePhoto(): void {
    const dialogRef = this.dialog.open(UploadPhotoComponent);

    dialogRef.afterClosed().subscribe(async (selectedFile: File | null) => {
      if (selectedFile) {
        try {
          const base64Image = await new FileUtils().convertToBase64(selectedFile);
          this.userImage = base64Image;
          this.user.photo = base64Image;
        } catch (error) {
          console.error('Error converting image to Base64:', error);
        }
      }
    });
  }

  private isAllowedEmailDomain(email: string): boolean {
    if (!email) return false;
    const domain = email.split('@')[1];
    return this.allowedDomains.includes(domain);
  }
}
