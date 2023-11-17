import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { Disciplina } from '../../models/Disciplina';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { DisciplinaService } from '../../services/disciplina.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-disciplinas',
  templateUrl: './disciplinas.component.html',
  styleUrls: ['./disciplinas.component.css']
})
export class DisciplinasComponent implements OnInit, OnDestroy {

  public modalRef!: BsModalRef;
  public disciplinaForm: FormGroup = new FormGroup({});
  public titulo = 'Disciplinas';
  public disciplinaSelecionada: Disciplina | null = null;
  private unsubscriber: Subject<void> = new Subject<void>();
  public disciplinas: Disciplina[] = [];
  public disciplina: Disciplina = new Disciplina();
  public msnDeleteDisciplina = '';
  public modeSave = 'post';

  constructor(
    private disciplinaService: DisciplinaService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.criarForm();
  }

  openModal(template: TemplateRef<any>, disciplinaId: number) {
  }

  closeModal() {
    this.modalRef?.hide();
  }

  ngOnInit() {
    this.carregarDisciplinas();
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  criarForm() {
    this.disciplinaForm = this.fb.group({
      id: [0],
      nome: ['', Validators.required],
          });
  }

  novaDisciplina() {
    this.disciplinaSelecionada = new Disciplina();
    this.disciplinaForm.patchValue(this.disciplinaSelecionada);
    this.disciplinaForm.reset();
    this.modeSave = 'post';
  }

  salvarDisciplina() {
    if (this.disciplinaForm.valid) {
      this.spinner.show();

      if (this.modeSave === 'post') {
        this.disciplina = { ...this.disciplinaForm.value };
        this.disciplinaService.post(this.disciplina)
          .pipe(takeUntil(this.unsubscriber))
          .subscribe(
            () => {
              this.carregarDisciplinas();
              this.toastr.success('Disciplina salva com sucesso.');
            },
            (error: any) => {
              this.toastr.error('Erro ao salvar disciplina.');
              console.error(error);
            },
            () => this.spinner.hide()
          );
      } else {
        this.disciplina = { id: this.disciplinaSelecionada?.id, ...this.disciplinaForm.value };
        this.disciplinaService.put(this.disciplina)
          .pipe(takeUntil(this.unsubscriber))
          .subscribe(
            () => {
              this.carregarDisciplinas();
              this.toastr.success('Disciplina atualizada com sucesso.');
            },
            (error: any) => {
              this.toastr.error('Erro ao atualizar disciplina.');
              console.error(error);
            },
            () => this.spinner.hide()
          );
      }
    }
  }

  carregarDisciplinas() {
    this.spinner.show();
    this.disciplinaService.getAll()
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((disciplinas: Disciplina[]) => {
        this.disciplinas = disciplinas;
        this.toastr.success('Disciplinas carregadas com sucesso.');
      }, (error: any) => {
        this.toastr.error('Erro ao carregar disciplinas.');
        console.log(error);
      }, () => this.spinner.hide()
      );
  }

  disciplinaSelect(disciplina: Disciplina) {
    this.modeSave = 'put';
    this.disciplinaSelecionada = disciplina;
    this.disciplinaForm.patchValue(disciplina);
  }

  deletarDisciplina(disciplina: Disciplina) {
    if (confirm(`Tem certeza que deseja excluir a disciplina ${disciplina.nome}?`)) {
      this.spinner.show();

      this.disciplinaService.delete(disciplina.id)
        .pipe(takeUntil(this.unsubscriber))
        .subscribe(
          () => {
            this.carregarDisciplinas();
            this.toastr.success('Disciplina excluída com sucesso.');
          },
          (error: any) => {
            this.toastr.error('Erro ao excluir disciplina.');
            console.error(error);
          },
          () => this.spinner.hide()
        );
    }
  }

  voltar() {
    this.disciplinaSelecionada = null;
  }

}
