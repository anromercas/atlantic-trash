import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {
  NgForm,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl,
  FormGroup
} from '@angular/forms';

import swal from 'sweetalert';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.component.html',
  styleUrls: ['./changepass.component.css']
})
export class ChangepassComponent implements OnInit {
  @Input() idUsuario: string;
  @Output() returnLogin: EventEmitter<any> = new EventEmitter();

  changePassForm: any;

  constructor(fb: FormBuilder, public _loginService: LoginService) {
    this.changePassForm = fb.group(
      {
        oldPass: ['', [Validators.required]],
        newPass: ['', [Validators.required]],
        newPassRepeat: ['', [Validators.required]]
      },
      { validator: this.checkPasswords }
    );
  }

  ngOnInit() {}

  checkPasswords(group: FormGroup) {
    const newPassValue = group.get('newPass').value;
    const newPassValueRepeat = group.get('newPassRepeat').value;

    return newPassValue === newPassValueRepeat ? null : { notSame: true };
  }

  changePass() {
    if (this.changePassForm.invalid) {
      swal(
        'ERROR',
        'Error en el formulario, por favor revise los datos',
        'warning'
      );
      return;
    }

    this._loginService
      .changePass(
        this.idUsuario,
        this.changePassForm.controls['oldPass'].value,
        this.changePassForm.controls['newPass'].value
      )
      .subscribe(
        () => {
          this.returnLogin.emit();
        },
        response => {
          swal('ERROR', response.error.message, 'warning');
        }
      );
  }
}
