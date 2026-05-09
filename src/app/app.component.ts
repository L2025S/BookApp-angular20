import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  darkMode = false;
  isLoggedIn = false;

  constructor(private router: Router) {
    // Listen to route changes to update login status (fixes logout button not showing after login)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isLoggedIn = !!localStorage.getItem('token');
    });
  }

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('token');
    // Listen to storage events (in case token changes in another tab)
    window.addEventListener('storage', () => {
      this.isLoggedIn = !!localStorage.getItem('token');
    });
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      this.darkMode = true;
      document.body.classList.add('bg-dark');
    }
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      document.body.classList.add('bg-dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('bg-dark');
      localStorage.setItem('darkMode', 'false');
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
