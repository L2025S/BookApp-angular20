import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {environment} from '../../environments/environment';


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

        // Empty the text boxes
        this.username = '';
        this.password = '';

        setTimeout(() => this.router.navigate(['/books']), 1000);
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

        // Empty the text boxes
        this.username = '';
        this.password = '';

        setTimeout(() => this.message = '', 1000);
      }
    });
  }

  register() {
    if (!this.registerUsername.trim() || !this.registerPassword.trim()) {
      this.message = 'Username and password cannot be empty';
      this.isError = true;
      setTimeout(() => this.message = '', 1000);
      return;
    }

    const newUser = this.registerUsername;
    const newPass = this.registerPassword;

    // Empty the text boxes on click the register button
    this.registerUsername = '';
    this.registerPassword = '';

    this.http.post(`${environment.apiUrl}/api/auth/register`, {
      username: newUser,
      password: newPass
    }).subscribe({
      next: () => {
        this.message = 'Registration successful!';
        this.isError = false;

        setTimeout(() => {
          this.message = '';
          this.showRegister = false;
        }, 1000);
      },
      error: (err) => {
        let errorMsg = 'Registration failed: Username may already exist.';
        if (err.error && typeof err.error === 'string') {
          errorMsg = err.error;
        } else if (err.error && err.error.message) {
          errorMsg = err.error.message;
        }

        this.message = errorMsg;
        this.isError = true;

        setTimeout(() => this.message = '', 1000);
      }
    });
  }
}
