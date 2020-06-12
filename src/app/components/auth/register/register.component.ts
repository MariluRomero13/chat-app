import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUser } from './../../../models/user';
import { AuthService } from './../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  user: IUser;
  constructor(private authSvc: AuthService, private router: Router) { this.createForm(); }

  ngOnInit(): void {
  }

  registerUser(): void {
    this.getUser();
    this.authSvc.registerUser(this.user).subscribe(res => {
      if (res.status) {
        this.authSvc.storeTokens(res.data);
        return this.router.navigate(['/chat'])
      }
    });
  }

  private createForm(): void {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.required)
    });
  }

  private getUser(): void {
    this.user = {
      ...this.registerForm.value
    };
  }
}
