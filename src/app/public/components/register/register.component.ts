import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { AuthenticationService } from "src/app/service/authentication.service";
import { MainService } from "src/app/service/main.service";

export interface UserModel {
  email: String;
  name: String;
  password: String;
}

@Component({
  templateUrl: "./register.component.html",
  //styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  private showToastr({
    position,
    title,
    message,
    status,
  }: {
    position?: any;
    title: string;
    message?: string;
    status: any;
  }): void {
    let realPosition = position ? position : "top-end";
    let realMessage = message ? message : "";
    let duractionMilisec = 4500;
    this.toastrService.show(`${realMessage}`, `${title}`, {
      position: realPosition,
      status,
      duration: duractionMilisec,
    });
  }

  public userForm: FormGroup;
  public submitted = false;
  public userList: UserModel[];
  readonly AUTHENTICATE_ENDPOINT = "api/register";
  readonly USER_ENDPOINT = "api/user";
  public source: LocalDataSource;
  public settings: any = {};
  public loading = false;

  constructor(
    private authenticationService: AuthenticationService,
    private toastrService: NbToastrService,
    private dialogservie: NbDialogService,
    private dialogService: NbDialogService,
    private router: Router,
    private formBuilder: FormBuilder,
    private mainService: MainService
  ) {
    this.source = new LocalDataSource();
    this.configSmartTable();
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      role: ["", [Validators.required, Validators.minLength(2)]],
    });
    this.loadUserList();
  }

  private loadUserList(): void {
    this.loading = true;
    this.mainService.get({ api: this.USER_ENDPOINT }).subscribe((response) => {
      this.userList = response.data;
      this.source.load(this.userList);
      this.loading = false;
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    const userModel: UserModel = {
      name: this.userForm.controls.name.value,
      email: this.userForm.controls.email.value,
      password: this.userForm.controls.password.value,
      //role: this.userForm.controls.role.value,
    };

    this.mainService
      .post({ api: this.AUTHENTICATE_ENDPOINT, data: userModel })
      .subscribe((x) => {
        this.showToastr({
          title: "Usuario Creado Correctamente",
          status: "basic",
        });
      });

    this.submitted = true;
  }

  /**
   * Nebular Smart Table configuration
   * @returns void
   */
  private configSmartTable(): void {
    this.settings = {
      pager: {
        display: true,
        perPage: 10,
      },
      hideSubHeader: false,
      actions: {
        columnTitle: "Opciones",
        add: false,
        filter: false,
        edit: true,
        delete: true,
        position: "left",
      },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
        confirmDelete: true,
      },
      columns: {
        name: {
          title: "Nombres",
          filter: true,
          editable: false,
        },
        email: {
          title: "Correo Electronico",
          editable: false,
        },
        role: {
          title: "Rol",
          editable: false,
        },
      },
    };
  }
}
