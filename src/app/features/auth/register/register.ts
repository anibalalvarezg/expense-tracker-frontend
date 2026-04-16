import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html'
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = signal('');
  email = signal('');
  password = signal('');
  error = signal('');
  loading = signal(false);

  onSubmit() {
    this.loading.set(true);
    this.error.set('');

    this.authService.register({
      name: this.name(),
      email: this.email(),
      password: this.password()
    }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error.set(err.error?.message || 'Error al registrarse');
        this.loading.set(false);
      }
    });
  }
}
