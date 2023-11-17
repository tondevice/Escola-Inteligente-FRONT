import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { Professor } from '../../models/Professor';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProfessorService } from '../../services/professor.service';
import { takeUntil } from 'rxjs/operators';
import { Util } from '../../util/util';
import { Disciplina } from '../../models/Disciplina';
import { Router } from '@angular/router';
import { Aluno } from '../../models/Aluno';
import { AlunoService } from '../../services/aluno.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-professores',
  templateUrl: './professores.component.html',
  styleUrls: ['./professores.component.css']
})
export class ProfessoresComponent implements OnInit, OnDestroy {

  public titulo = 'Professores';
  public professorSelecionado: Professor | null = null;
  private unsubscriber: Subject<void> = new Subject<void>();
  public professores: Professor[];
  public professorForm: FormGroup = new FormGroup({});
  public professor: Professor = new Professor;
  public modeSave: 'post';
  public textSimple: '';
  public modeSav: 'put';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private router: Router,
    private professorService: ProfessorService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
    ) {
      this.criarForm();
    }

    ngOnInit() {
      this.carregarProfessores();
    }
  
    ngOnDestroy(): void {
      this.unsubscriber.next();
      this.unsubscriber.complete();
    }
  
    disciplinaConcat(disciplinas: Disciplina[]) {
      if (disciplinas && disciplinas.length > 0) {
        return Util.nomeConcat(disciplinas);
      } else {
        return 'Nenhuma disciplina associada';
      }
    }
    
    criarForm(){
      this.professorForm = this.fb.group({
        id: [''],
        nome: ['', Validators.required]
      });
    }

    saveProf() {
      if (this.professorForm.valid) {
        this.spinner.show();
        
        if (this.modeSave === 'post') {
          this.professor = { ...this.professorForm.value };
          this.professorService.post(this.professor)
          .pipe(takeUntil(this.unsubscriber))
          .subscribe(
            () => {
              this.carregarProfessores();
              this.toastr.success;
            },
            (error: any) => {
              this.toastr.error;
              console.error(error);
            },
            () => this.spinner.hide()
            );
          } else {
            this.professor = { id: this.professorSelecionado?.id, ...this.professorForm.value };
            this.professorService.put(this.professor) 
            .pipe(takeUntil(this.unsubscriber))
            .subscribe(
              () => {
                this.carregarProfessores();
                this.toastr.success;
              },
              (error: any) => {
                this.toastr.error;
                console.error(error);
              },
              () => this.spinner.hide()
              );
            }
          }
        }

  carregarProfessores() {
    this.spinner.show();
    this.professorService.getAll()
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((professores: Professor[]) => {
        this.professores = professores;
        this.toastr.success;
      }, (error: any) => {
        this.toastr.error;
        console.log(error);
      }, () => this.spinner.hide()
    );
  }

  professorSelect(professor: Professor){
    this.modeSav = 'put';
    this.professorSelecionado = professor;
    this.professorForm.patchValue(professor);
  }

  novoProfessor() {
    this.professorSelecionado = new Professor();
    this.professorForm.patchValue(this.professorSelecionado);
    this.professorForm.reset();
    this.modeSave = 'post';
  }

  deletar(professor: Professor) {
    if (confirm(`Tem certeza que deseja excluir o professor ${professor.nome}?`)) {
      this.spinner.show();
      
      this.professorService.delete(professor.id)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe(
        () => {
          this.carregarProfessores();
          this.toastr.success;
        },
        (error: any) => {
          this.toastr.error('Erro ao excluir professor!');
          console.error(error);
        },
        () => this.spinner.hide()
        );
      }
    }

  voltar(){
    this.professorSelecionado = null;
  }

}
