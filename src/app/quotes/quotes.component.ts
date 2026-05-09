import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';

interface Quote {
  id: number;
  text: string;
  author: string;
}

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit {
  quotes: Quote[] = [];
  currentQuote: Quote = { id: 0, text: '', author: '' };
  showForm = false;
  editingQuote = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadQuotes();
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.cancelEdit();
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }) };
  }

  loadQuotes() {
    this.http.get<Quote[]>(`${environment.apiUrl}/api/quotes`, this.getHeaders())
      .subscribe({
        next: (data) => {
          this.quotes = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Failed to load quotes:', err)
      });
  }

  saveQuote() {
    if (!this.currentQuote.text?.trim()) {
      alert('Please enter quote text');
      return;
    }

    if (this.editingQuote) {
      // Update existing quote
      this.http.put(`${environment.apiUrl}/api/quotes/${this.currentQuote.id}`, this.currentQuote, this.getHeaders())
        .subscribe({
          next: () => {
            alert('✅ Quote updated successfully!');
            this.loadQuotes();
            this.cancelEdit(); // Closes form and clears fields
          },
          error: (err) => {
            console.error(err);
            alert('❌ Update failed. Please try again.');
          }
        });
    } else {
      // Create new quote
      this.http.post(`${environment.apiUrl}/api/quotes`, this.currentQuote, this.getHeaders())
        .subscribe({
          next: () => {
            alert('✅ Quote added successfully!');
            this.loadQuotes();
            // Clear form but keep it open for continuous adding
            this.currentQuote = { id: 0, text: '', author: '' };
            this.editingQuote = false;
            // showForm remains true
          },
          error: (err) => {
            console.error(err);
            alert('❌ Add failed. Please try again.');
          }
        });
    }
  }

  editQuote(quote: Quote) {
    this.currentQuote = { ...quote };
    this.showForm = true;
    this.editingQuote = true;
    setTimeout(() => {
      document.querySelector('.card')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  deleteQuote(id: number) {
    if (confirm('Are you sure you want to delete this quote?')) {
      this.http.delete(`${environment.apiUrl}/api/quotes/${id}`, this.getHeaders())
        .subscribe({
          next: () => {
            alert('🗑️ Quote deleted successfully');
            this.loadQuotes();
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
    this.editingQuote = false;
    this.currentQuote = { id: 0, text: '', author: '' };
  }
}
