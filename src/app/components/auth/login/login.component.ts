import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IAuth } from './../../../models/auth';
import { AuthService } from './../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  user: IAuth;
  constructor(private authSvc: AuthService, private router: Router) { this.createForm(); }

  ngOnInit(): void {
  }

  login(): void {
    if (this.loginForm.valid) {
      this.getUser();
      this.authSvc.login(this.user).subscribe(res => {
        if (res === 200) {
          alert('Bienvenido')
          this.router.navigate(['/chat']);
        }
        if (res.error) {
          if (res.status === 401) {
            alert('Correo y/o contraseña incorrectos');
          }
        }
      });
    }
  }

  private getUser() {
    this.user = {
      ...this.loginForm.value
    };
  }

  private createForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.compose([Validators.required]))
    });
  }
}
