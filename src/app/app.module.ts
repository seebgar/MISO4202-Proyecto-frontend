import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { NbSecurityModule } from "@nebular/security";
import {
  NbActionsModule,
  NbButtonModule,
  NbCalendarModule,
  NbCalendarRangeModule,
  NbCardModule,
  NbContextMenuModule,
  NbDatepickerModule,
  NbDialogModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbMenuModule,
  NbPopoverModule,
  NbSearchModule,
  NbSelectModule,
  NbSidebarModule,
  NbSpinnerModule,
  NbStepperModule,
  NbTabsetModule,
  NbThemeModule,
  NbToastrModule,
  NbTooltipModule,
  NbUserModule,
  NbWindowModule,
} from "@nebular/theme";
import { ChartModule } from "angular2-chartjs";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ChartComponent } from "./public/components/chart/chart.component";
import { DashboardComponent } from "./public/components/dashboard/dashboard.component";
import { LoginComponent } from "./public/components/login/login.component";
import { RegisterComponent } from "./public/components/register/register.component";
import { HomeComponent } from "./public/home/home.component";
import { FooterComponent } from "./public/layout/footer/footer.component";
import { HeaderComponent } from "./public/layout/header/header.component";
import { SidebarComponent } from "./public/layout/sidebar/sidebar.component";
import { AuthenticationService } from "./service/authentication.service";
import { ErrorInterceptor } from "./service/error-interceptor.service";
import { JwtInterceptor } from "./service/jwt-interceptor.service";
import { MainService } from "./service/main.service";
import { DataComponent } from "./public/components/data/data.component";


import { InsumosComponent } from "./public/components/insumos/insumos.component";
import { ProveedoresComponent } from "./public/components/proveedores/proveedores.component";
import { ProductosComponent } from "./public/components/productos/productos.component";
import { OrdenesDeCompraComponent } from "./public/components/ordenesdecompra/ordenesdecompra.component";



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    DataComponent,
	
	 InsumosComponent,
	 ProveedoresComponent,
	 ProductosComponent,
	 OrdenesDeCompraComponent,
   
    
    ChartComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ChartModule,
    FormsModule,

    NbThemeModule.forRoot({ name: "default" }),

    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),

    Ng2SmartTableModule,
    NbCardModule,
    NbInputModule,
    NbCalendarModule,
    NbPopoverModule,
    NbSpinnerModule,
    NbTabsetModule,
    NbCalendarRangeModule,
    NbStepperModule,
    NbTooltipModule,

    NbLayoutModule,
    NbMenuModule,
    NbUserModule,
    NbActionsModule,
    NbSearchModule,
    NbSidebarModule,
    NbContextMenuModule,
    NbSecurityModule,
    NbButtonModule,
    NbSelectModule,
    NbIconModule,
    NbEvaIconsModule,

    NbLayoutModule,
    NbEvaIconsModule,

    AppRoutingModule,
  ],
  exports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    MainService,
    AuthenticationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
