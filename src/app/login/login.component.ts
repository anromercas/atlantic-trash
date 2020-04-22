import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import swal from 'sweetalert';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  recuerdame = false;
  showLogin: boolean = true;
  setupTwoFactor: boolean = false;
  loginTwoFactor: boolean = false;
  imgQR: SafeUrl;
  codeToken: string;
  password: string = undefined;

  usuario: any;
  showChangePassword: boolean;
  idUsuario: any;

  constructor(
    public _loginService: LoginService,
    public router: Router,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1) {
      this.recuerdame = true;
    }
    this.password = undefined;
  }

  login(forma: NgForm) {
    if (forma.invalid) {
      return;
    }
    this._loginService
      .loginEmailUser(
        forma.value.email,
        forma.value.pass,
        forma.value.recuerdame
      )
      .subscribe(
        (response: any) => {
          const { status } = response;
          switch (status) {
            case 204:
              this.showLogin = false;
              this.showChangePassword = true;
              break;
            case 206:
              const { goto } = response.body;
              if (goto && goto === 1) {
                // Debe cambiar la contraseña
                this.showLogin = false;
                this.showChangePassword = true;
                this.idUsuario = response.body.id;
              } else if (goto && goto === 2) {
                // Debe introducir contraseña two Factor
                this.password = forma.value.pass;
                this.loginTwoFactor = true;
                this.showLogin = false;

                this.usuario = {
                  ...response.body.usuario,
                  token: response.body.token
                };
              } else {
                const { err } = response.body;
                if (err.message === 'Introducir OTP para continuar') {
                  // Goto login TwoFactor
                  this.loginTwoFactor = true;
                  this.showLogin = false;
                  this.password = forma.value.pass;
                  this.usuario = {
                    ...response.body.usuario,
                    pass: forma.value.pass
                  };
                } else {
                  swal('ERROR', err.message, 'warning');
                }
              }
              break;
            case 205:
              // Debe configurar two Factor
              const { usuario } = response.body;
              this.usuario = {
                ...usuario,
                token: response.body.token
              };
              this._loginService
                .setupTwoFactor(usuario)
                .subscribe((resp: any) => {
                  this.password = forma.value.pass;

                  this.imgQR = resp.usuario.twofactor.dataURL;
                  this.codeToken = resp.usuario.twofactor.tempSecret;
                  this.setupTwoFactor = true;
                  this.showLogin = false;
                });
              break;
            default:
              swal('ERROR', 'No encontramos código twoFactor', 'warning');
              break;
          }
        },
        (response: any) => {
          const { error } = response;
          swal('ERROR', error.err.message, 'warning');
        }
      );
  }

  showTwoFactorLogin() {
    this.setupTwoFactor = false;
    this.loginTwoFactor = true;
  }

  returnLogin() {
    this.loginTwoFactor = false;
    this.setupTwoFactor = false;
    this.showChangePassword = false;
    this.showLogin = true;
  }

  onTwoFactorLogin(forma: NgForm) {
    if (forma.invalid) {
      return;
    }

    this._loginService
      .loginTwoFactor(this.usuario, this.password, forma.value.twoFactorCode)
      .subscribe(
        (data: any[]) => {
          this._loginService.loginUser(data[1]);
          return;
        },
        response => {
          swal('ERROR', response.err || response.err.message, 'warning');
        }
      );
  }

  goBack() {
    this.showLogin = true;
    this.setupTwoFactor = false;
    this.loginTwoFactor = false;
  }
}
