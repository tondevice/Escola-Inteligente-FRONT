import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { AlunosComponent } from "./components/alunos/alunos.component";
import { ProfessoresAlunosComponent } from "./components/alunos/professores-alunos/professores-alunos.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { PerfilComponent } from "./components/perfil/perfil.component";
import { AlunosProfessoresComponent } from "./components/professores/alunos-professores/alunos-professores.component";
import { ProfessorDetalheComponent } from "./components/professores/professor-detalhe/professor-detalhe.component";
import { ProfessoresComponent } from "./components/professores/professores.component";
import { NavComponent } from "./components/shared/nav/nav.component";
import { TituloComponent } from "./components/shared/titulo/titulo.component";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";
import { HttpClientModule } from "@angular/common/http";
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from "ngx-toastr";
import { RouterModule } from "@angular/router";
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from "@angular/core";
import { DisciplinasComponent } from "./components/disciplinas/disciplinas.component";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    AlunosComponent,
    AlunosProfessoresComponent,
    ProfessoresComponent,
    ProfessoresAlunosComponent,
    ProfessorDetalheComponent,
    PerfilComponent,
    DashboardComponent,
    NavComponent,
    TituloComponent,
    DisciplinasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    HttpClientModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 3500,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true
    }),
    RouterModule ,
    CommonModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
