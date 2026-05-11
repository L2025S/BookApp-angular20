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

  // ==================== REGISTER (FIXED VERSION) ====================
  register() {
    // 1. Basic validation
    if (!this.registerUsername.trim() || !this.registerPassword.trim()) {
      this.message = 'Username and password cannot be empty';
      this.isError = true;
      setTimeout(() => this.message = '', 3000);
      return;
    }

    const newUser = this.registerUsername;
    const newPass = this.registerPassword;

    // ❌ FIXED: DO NOT clear input fields before sending the request.
    // Doing so causes Angular to think the fields are empty and triggers error UI.
    // this.registerUsername = '';
    // this.registerPassword = '';

    this.http.post(`${environment.apiUrl}/api/auth/register`, {
      username: newUser,
      password: newPass
    }).subscribe({
      next: (response: any) => {
        console.log('Registration success:', response);

        // Use backend message if available
        const successMsg = response?.message || 'Registration successful!';
        this.message = successMsg;
        this.isError = false;

        // ✅ FIXED: Clear input fields AFTER successful registration
        // This prevents UI from showing "failure" due to empty fields.
        this.registerUsername = '';
        this.registerPassword = '';

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.message = '';
        }, 3000);
      },
      error: (err) => {
        console.error('Registration error:', err);

        let errorMsg = 'Registration failed. Please try again.';

        if (err.error && typeof err.error === 'object' && err.error.message) {
          errorMsg = err.error.message;
        } else if (err.error && typeof err.error === 'string') {
          errorMsg = err.error;
        } else if (err.message) {
          errorMsg = err.message;
        }

        this.message = errorMsg;
        this.isError = true;

        // Clear error message after 3 seconds
        setTimeout(() => this.message = '', 3000);
      }
    });
  }
  // ==================== END REGISTER ====================
}
