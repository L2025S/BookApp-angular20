import { Component, OnInit, ChangeDetectorRef } from '@angular/core';   // Import ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';

interface Book {
  id: number;
  title: string;
  author: string;
  publishedDate: string;
}

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  currentBook: Book = { id: 0, title: '', author: '', publishedDate: '' };
  showForm = false;
  isEditMode = false;

  // Inject ChangeDetectorRef
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadBooks();
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.cancelEdit();
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }) };
  }

  loadBooks() {
    this.http.get<Book[]>(`${environment.apiUrl}/api/books`, this.getHeaders())
      .subscribe({
        next: (data) => {
          console.log('✅ Books received:', data);
          this.books = data;
          // Force view update
          this.cdr.detectChanges();
          console.log('✅ this.books after assignment:', this.books);
        },
        error: (err) => console.error('Load failed:', err)
      });
  }

  saveBook() {
    if (!this.currentBook.title?.trim() || !this.currentBook.author?.trim()) {
      alert('Please fill in both title and author');
      return;
    }
    if (this.isEditMode) {
      this.http.put(`${environment.apiUrl}/api/books/${this.currentBook.id}`, this.currentBook, this.getHeaders())
        .subscribe({
          next: () => {
            alert('✅ Book updated successfully!');
            this.loadBooks();
            this.cancelEdit();
          },
          error: (err) => {
            console.error(err);
            alert('❌ Update failed. Please try again.');
          }
        });
    } else {
      this.http.post(`${environment.apiUrl}/api/books`, this.currentBook, this.getHeaders())
        .subscribe({
          next: () => {
            alert('✅ Book added successfully!');
            this.loadBooks();
            this.cancelEdit();
          },
          error: (err) => {
            console.error(err);
            alert('❌ Add failed. Please try again.');
          }
        });
    }
  }

  editBook(book: Book) {
    this.currentBook = { ...book };
    this.showForm = true;
    this.isEditMode = true;
  }

  deleteBook(id: number) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.http.delete(`${environment.apiUrl}/api/books/${id}`, this.getHeaders())
        .subscribe({
          next: () => {
            alert('🗑️ Book deleted successfully');
            this.loadBooks();
          },
          error: (err) => {
            console.error(err);
            alert('❌ Delete failed. Please try again.');
          }
        });
    }
  }

  cancelEdit() {
    this.showForm = false;
    this.isEditMode = false;
    this.currentBook = { id: 0, title: '', author: '', publishedDate: '' };
  }
}
