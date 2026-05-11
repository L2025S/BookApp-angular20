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

  // ==================== MODIFIED REGISTER METHOD ====================
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

    // 2. Clear input fields immediately
    this.registerUsername = '';
    this.registerPassword = '';

    // 3. Send registration request
    this.http.post(`${environment.apiUrl}/api/auth/register`, {
      username: newUser,
      password: newPass
    }).subscribe({
      next: (response: any) => {
        // ---- FIX: Backend now returns JSON like { message: "User created successfully." } ----
        // Angular can parse it without error, so we reach here.
        console.log('Registration success:', response);

        // Use the backend message if available, otherwise fallback
        const successMsg = response?.message || 'Registration successful!';
        this.message = successMsg;
        this.isError = false;

        // Keep the success message visible for 3 seconds, then clear it
        setTimeout(() => {
          this.message = '';
        }, 3000);

        // Optional:Automatically switch back to login after 3 seconds

        //setTimeout(() => this.showRegister = false, 3000);
      },
      error: (err) => {
        // ---- Handle error responses (e.g., 400 Bad Request with JSON body) ----
        console.error('Registration error:', err);

        let errorMsg = 'Registration failed. Please try again.';

        // Extract error message from backend JSON response if possible
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
  // ==================== END OF MODIFIED REGISTER METHOD ====================
}
