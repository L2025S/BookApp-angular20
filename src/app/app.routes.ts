import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BooksComponent } from './books/books.component';
import { QuotesComponent } from './quotes/quotes.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'books', component: BooksComponent, canActivate: [AuthGuard] },
  { path: 'quotes', component: QuotesComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/books', pathMatch: 'full' },     // 默认跳转到 /books
  { path: '**', redirectTo: '/books' }
];

