import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { CONTENEDORES } from '../../data/data.contenedores';
import { ZONAS } from '../../data/data.zonas';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-formulario-contenedor',
  templateUrl: './formulario-contenedor.component.html',
  styleUrls: ['./formulario-contenedor.component.css']
})
export class FormularioContenedorComponent implements OnInit {
  contenedorForm: FormGroup;
  onSending: boolean = false;

  basurasSelect = CONTENEDORES;
  zonasSelect = [];

  constructor(fb: FormBuilder, public emailService: EmailService) {
    this.contenedorForm = fb.group({
      zonaContenedor: new FormControl('', Validators.required),
      nombreContenedor: new FormControl('', Validators.required),
      numeroContenedor: new FormControl('', Validators.required),
      accion: new FormControl('', Validators.required),
      observaciones: new FormControl('')
    });
  }

  ngOnInit(): void {
    const zonasTemp = ZONAS;
    for (let zona of zonasTemp) {
      // Cambiado según necesidades del cliente - 28/01/2020
      zona.nombre.startsWith('Zona 1') ? (zona.area = 'Manipulación de Materiales') : zona.area;
    }
    this.zonasSelect = zonasTemp;
  }

  handleSubmit() {
    if (!this.contenedorForm.valid) {
      alert('Error en los datos del formulario, por favor, reviselo');
      return;
    }

    this.onSending = true;
    this.emailService.sendForm(this.contenedorForm.value).subscribe(
      data => {
        alert('Solicitud enviada.');
        this.onSending = false;
        this.contenedorForm.reset();
      },
      () => {
        alert('Error al enviar la solicitudo. Por favor, intentelo más tarde.');
        this.onSending = false;
      }
    );
  }
}
