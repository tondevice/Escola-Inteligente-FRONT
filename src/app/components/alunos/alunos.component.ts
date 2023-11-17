import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { Aluno } from '../../models/Aluno';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlunoService } from '../../services/aluno.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ProfessorService } from '../../services/professor.service';
import { Professor } from '../../models/Professor';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-alunos',
  templateUrl: './alunos.component.html',
  styleUrls: ['./alunos.component.css']
})
export class AlunosComponent implements OnInit, OnDestroy {
  
  
  public modalRef!: BsModalRef;
  public alunoForm: FormGroup = new FormGroup({});
  public titulo = 'Alunos';
  public alunoSelecionado: Aluno | null = null;
  public textSimple = '';
  public profsAlunos: Professor[] = [];
  private unsubscriber: Subject<void> = new Subject<void>();
  public alunos: Aluno[] = [];
  public aluno: Aluno = new Aluno();
  public msnDeleteAluno = '';
  public modeSave = 'post';
  
  constructor(
    private alunoService: AlunoService,
    private route: ActivatedRoute,
    private professorService: ProfessorService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
    ) 
    
    
    {
      this.criarForm();
    }
    
    
    openModal(template: TemplateRef<any>, alunoId: number) {
      this.professoresAlunos(template, alunoId);
    }
    
    closeModal() {
      this.modalRef?.hide();
    }
    
    professoresAlunos(template: TemplateRef<any>, id: number) {
      this.spinner.show();
      this.professorService.getByAlunoId(id)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((professores: Professor[]) => {
        this.profsAlunos = professores;
        this.modalRef = this.modalService.show(template);
      }, (error: any) => {
        this.toastr.error(`erro: ${error}`);
        console.log(error);
      }, () => this.spinner.hide()
      );
    }
    
    ngOnInit() {
      this.carregarAlunos();
    }
    
    ngOnDestroy(): void {
      this.unsubscriber.next();
      this.unsubscriber.complete();
    }
    
    criarForm() {
      this.alunoForm = this.fb.group({
        id: [0],
        nome: ['', Validators.required],
        sobrenome: ['', Validators.required],
        telefone: ['', Validators.required]
      });
    }
    
    novoAluno() {
      this.alunoSelecionado = new Aluno();
      this.alunoForm.patchValue(this.alunoSelecionado);
      this.alunoForm.reset();
      this.modeSave = 'post';
    }
    
    saveAluno() {
      if (this.alunoForm.valid) {
        this.spinner.show();
        
        if (this.modeSave === 'post') {
          this.aluno = { ...this.alunoForm.value };
          this.alunoService.post(this.aluno)
          .pipe(takeUntil(this.unsubscriber))
          .subscribe(
            () => {
              this.carregarAlunos();
              this.toastr.success;
            },
            (error: any) => {
              this.toastr.error;
              console.error(error);
            },
            () => this.spinner.hide()
            );
          } else {
            this.aluno = { id: this.alunoSelecionado?.id, ...this.alunoForm.value };
            this.alunoService.put(this.aluno) 
            .pipe(takeUntil(this.unsubscriber))
            .subscribe(
              () => {
                this.carregarAlunos();
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
        
        
        carregarAlunos() {
          this.spinner.show();
          this.alunoService.getAll()
          .pipe(takeUntil(this.unsubscriber))
          .subscribe((alunos: Aluno[]) => {
            this.alunos = alunos;
            this.toastr.success;
          }, (error: any) => {
            this.toastr.error;
            console.log(error);
          }, () => this.spinner.hide()
          );
        }
        
        alunoSelect(aluno: Aluno) {
          this.modeSave = 'put';
          this.alunoSelecionado = aluno;
          this.alunoForm.patchValue(aluno);
        }
        
        ativar(aluno: Aluno) {
          if (confirm(`Tem certeza que deseja ativar o aluno ${aluno.nome}?`)) {
            this.spinner.show();
            
            this.alunoService.ativarAluno(aluno.id)
            .pipe(takeUntil(this.unsubscriber))
            .subscribe(
              () => {
                this.carregarAlunos();
                this.toastr.success('Aluno ativado com sucesso');
              },
              (error: any) => {
                this.toastr.error('Erro ao ativar aluno!');
                console.error(error);
              },
              () => this.spinner.hide()
              );
            }
          }
          
          desativar(aluno: Aluno) {
            if (confirm(`Tem certeza que deseja desativar o aluno ${aluno.nome}?`)) {
              this.spinner.show();
              
              this.alunoService.desativarAluno(aluno.id)
              .pipe(takeUntil(this.unsubscriber))
              .subscribe(
                () => {
                  this.carregarAlunos();
                  this.toastr.success('Aluno desativado com sucesso');
                },
                (error: any) => {
                  this.toastr.error('Erro ao desativar aluno!');
                  console.error(error);
                },
                () => this.spinner.hide()
                );
              }
            }
            
            toggleAtivarDesativarAluno(aluno: Aluno) {
              const confirmMessage = aluno.ativo ? 'Tem certeza que deseja desativar o aluno?' : 'Tem certeza que deseja ativar o aluno?';
              if (confirm(confirmMessage)) {
                this.spinner.show();
                
            this.alunoService.toggleAtivo(aluno.id)
                .pipe(takeUntil(this.unsubscriber))
                .subscribe(
                  () => {
                    this.carregarAlunos();
                    const sucessoMessage = aluno.ativo ? 'Aluno desativado com sucesso' : 'Aluno ativado com sucesso';
                    this.toastr.success(sucessoMessage);
                  },
                  (error: any) => {
                    const errorMessage = aluno.ativo ? 'Erro ao desativar aluno!' : 'Erro ao ativar aluno!';
                    this.toastr.error(errorMessage);
                    console.error(error);
                  },
                  () => this.spinner.hide()
                  );
                }
              }
              
              voltar() {
                this.alunoSelecionado = null;
              }
              
            }