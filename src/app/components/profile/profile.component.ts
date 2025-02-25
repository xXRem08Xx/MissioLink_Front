import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, AuthResponse } from '../../services/auth/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  user: any;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    const authDataString = localStorage.getItem('authData');
    if (authDataString) {
      const authData: AuthResponse = JSON.parse(authDataString);
      this.user = authData.user;
    }
    this.profileForm = this.fb.group({
      email: [{ value: this.user?.email, disabled: true }, [Validators.required, Validators.email]],
      nom: [this.user?.nom, Validators.required],
      prenom: [this.user?.prenom, Validators.required],
      telephone: [this.user?.telephone],
      adresse: [this.user?.adresse],
      password: ['']
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const formData = this.profileForm.getRawValue();
      if (!formData.password) {
        delete formData.password;
      }
      this.authService.updateProfile(formData)
        .pipe(
          tap(response => {
            const authDataString = localStorage.getItem('authData');
            if (authDataString) {
              const authData: AuthResponse = JSON.parse(authDataString);
              authData.user = response;
              localStorage.setItem('authData', JSON.stringify(authData));
              this.user = response;
            }
          })
        )
        .subscribe({
          next: () => { console.log('Profile updated successfully.'); },
          error: (err) => { console.error('Error updating profile:', err); }
        });
    }
  }
}
