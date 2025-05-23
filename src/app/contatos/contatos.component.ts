import { Component, OnInit } from '@angular/core';
import { Contato } from '../contato';
import { ContatosService } from '../contatos.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-contatos',
  standalone: false,
  templateUrl: './contatos.component.html',
  styleUrl: './contatos.component.css',
})
export class ContatosComponent implements OnInit {
  contatos: Contato[] = [];
  formGroupContatos: FormGroup;
  isEditMode: boolean = false;
  currentContatoId: number | null = null;

  constructor(
    private service: ContatosService,
    private formBuilder: FormBuilder
  ) {
    this.formGroupContatos = formBuilder.group({
      id: [''],
      contato: [''],
      numero: [''],
    });
  }

  ngOnInit(): void {
    this.loadContatos();
  }

  loadContatos() {
    this.service.getContatos().subscribe({
      next: (json) => (this.contatos = json),
    });
  }

  saveContato() {
    this.service.saveContato(this.formGroupContatos.value).subscribe({
      next: (json) => {
        this.contatos.push(json);
        this.formGroupContatos.reset();
      },
    });
  }

  deleteContato(contato: Contato) {
    this.service.deleteContato(contato).subscribe({
      next: () => this.loadContatos(),
    });
  }

  editContato(contato: Contato) {
    this.isEditMode = true;
    this.currentContatoId = contato.id;
    this.formGroupContatos.setValue({
      id: contato.id,
      contato: contato.contato,
      numero: contato.numero,
    });
  }

  closeEditMode() {
    this.isEditMode = false;
    this.formGroupContatos.reset();
  }

  updateContato() {
    const updateContato = this.formGroupContatos.value;
    this.service.updateContato(updateContato).subscribe({
      next: () => {
        this.loadContatos();
        this.closeEditMode();
      },
    });
  }
}
