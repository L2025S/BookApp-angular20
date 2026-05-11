import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  registerUsername = '';
  registerPassword = '';
  showRegister = false;
  message = '';
  isError = false;

  constructor(private http: HttpClient, private router: Router) {}

  // ==================== LOGIN ====================
  login() {
    this.http.post(`${environment.apiUrl}/api/auth/login`, {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        this.message = 'Login successful!';
        this.isError = false;
        this.username = '';
        this.password = '';

        setTimeout(() => this.router.navigate(['/books']), 2000);
      },
      error: (err) => {
        let errorMsg = 'Login failed: Incorrect username or password';
        if (err.error && typeof err.error === 'string') {
          errorMsg = err.error;
        } else if (err.error && err.error.message) {
          errorMsg = err.error.message;
        }
        this.message = errorMsg;
        this.isError = true;
        this.username = '';
        this.password = '';

        setTimeout(() => this.message = '', 3000);
      }
    });
  }

  // ==================== REGISTER (WITH FRONTEND VALIDATION) ====================
  register() {
    // CHANGE: The HTML template already validates length requirements via minlength/maxlength.
    // However, also keep a safety check in TS to prevent submission if validation fails.
    const isUsernameValid = this.registerUsername &&
      this.registerUsername.trim().length >= 3 &&
      this.registerUsername.trim().length <= 50;
    const isPasswordValid = this.registerPassword &&
      this.registerPassword.length >= 8 &&
      this.registerPassword.length <= 100;

    if (!isUsernameValid || !isPasswordValid) {
      this.message = 'Please ensure username is 3-50 chars and password is 8-100 chars.';
      this.isError = true;
      setTimeout(() => this.message = '', 3000);
      return;
    }

    const newUser = this.registerUsername.trim();
    const newPass = this.registerPassword;

    this.http.post(`${environment.apiUrl}/api/auth/register`, {
      username: newUser,
      password: newPass
    }).subscribe({
      next: (response: any) => {
        console.log('Registration success:', response);

        const successMsg = response?.message || 'Registration successful!';
        this.message = successMsg;
        this.isError = false;

        this.registerUsername = '';
        this.registerPassword = '';

        setTimeout(() => {
          this.message = '';
          // Optionally switch to login view after success
          this.showRegister = false;
        }, 3000);
      },
      error: (err) => {
        console.error('Registration error:', err);

        let errorMsg = 'Registration failed. ';
        if (err.error && typeof err.error === 'object' && err.error.message) {
          errorMsg = err.error.message;
        } else if (err.error && typeof err.error === 'string') {
          errorMsg = err.error;
        } else if (err.message) {
          errorMsg = err.message;
        }

        this.message = errorMsg;
        this.isError = true;

        setTimeout(() => this.message = '', 3000);
      }
    });
  }
}
