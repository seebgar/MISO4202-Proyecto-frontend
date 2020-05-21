import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { LocalDataSource } from "ng2-smart-table";
//import { AuthService } from "src/app/service/auth.service";
import { MainService } from "src/app/service/main.service";
import { NbToastrService, NbDialogService } from "@nebular/theme";
import { FormGroupDirective } from "@angular/forms";
 	
@Component({
  selector: "app-insumos",
  templateUrl: "./insumos.component.html",
  styleUrls: ["./insumos.component.scss"],
})
export class InsumosComponent implements OnInit, OnDestroy {
  /* Manejo de Usuario */
  public user: any = {};

  /* Titulo en HTML */
  public titulo = "Insumos";

  /* Indica el estado de carga */
  public cargando: boolean = false;

  /* API Routes */
  readonly API_ALL: string = "api/insumos";

  /* Observables - Async */
  public allObervable: Observable<any>;

  /* Manejo de subscripcion para evitar Memory Leaks */
  // disclamer: HTTP Request manejan su propio unsubscribe por lo que no generan leaks.
  public subscriptions: Subscription[] = [];

  /* Nebular Smart Table Configuration */
  public source: LocalDataSource;
  public settings: any = {};

  /* Objeto creado a partir de un Form */
  public objetoCreado: any = {};

  /* Child References */
  @ViewChild("dialogAgregar", { static: true }) dialogAgregar: ElementRef;
  @ViewChild("addForm", { static: false }) addForm: FormGroupDirective;

  /* Dialog que se encuentra abierto */
  public dialogActivo: any;
  
  constructor(
  //  private authService: AuthService,
    private mainService: MainService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private router: Router
  ) {
    this.source = new LocalDataSource();
    this.config();
  }

  ngOnInit() {
  //  this.user = this.authService.user;

    if (this.isAdmin()) {
      this.getAll();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  // =================================
  // Metodos
  // ================================

  /**
   * Verifica si el usuario en sesi�n tiene
   * permisos de administrador
   * @returns {boolean}
   */
  public isAdmin(): boolean {
    return true;
  }

  /**
   * Organiza por fecha de creadcion en el servidor
   * @param a primer objeto
   * @param b segundo objeto
   */
  public sortCreatedAt(a, b): number {
    const dateA: Date = a ? new Date(a.createdAt) : new Date();
    const dateB: Date = b ? new Date(b.createdAt) : new Date();
    return dateB.getTime() - dateA.getTime();
  }

  // =================================
  // Metodos Handlers
  // ================================

  /**
   * De abrir el dialog que le permite al usuario
   * registar un nuevo objeto
   * @returns void
   */
  public handleModalAgregar(): void {
    this.showDialog({ dialog: this.dialogAgregar });
  }

  /**
   * Muestra un mensaje cuando el servidor responde NULL
   */
  public handleResponseNull(): void {
    this.showToastr({
      title: "No se ha establecido una conexi�n con el servidor.",
      status: "basic",
    });
  }

  /**
   * Muestra un mensaje con el error
   * @param {any} error generado por el request
   */
  public handleError({ error }: { error: any }): void {
    this.showToastr({
      title: "Se han encontrado errores.",
      status: "warning",
      message: error.message || error || "not found",
    });
  }

  /**
   * Muestra un mensaje de success
   * @param {string} title del mensaje
   */
  public handleSuccess({ title }: { title: string }): void {
    this.showToastr({
      title: `${title}`,
      status: "success",
    });
  }

  // =================================
  // Metodos CRUD
  // ================================

  /**
   * Obtiene los objeto del servidor
   * @returns void
   */
  public getAll(): void {
    this.cargando = true;

    this.allObervable = this.mainService.get({
      api: this.API_ALL,
    });

    const subs = this.allObervable.subscribe(
      response => {
        if (response) {
          if (response.errors) {
            this.handleError({ error: response.message });
          } else {
            const objetos = response as any[];
            this.source.load(objetos.sort(this.sortCreatedAt));
          }
        } else {
          this.handleResponseNull();
          this.source.load([]);
        }
      },
      error => {
        this.handleError({ error });
        this.cargando = false;
        this.source.load([]);
      },
      () => {
        this.cargando = false;
      }
    );

    this.subscriptions.push(subs);
  }

 

  /**
   * Crea un objeto usando la msmart table
   * @param {content} value del formulario en Smart Table
   * @returns void
   */
  public onCreate({ content }: { content: any }): void {
    if (!content || !content.newData) {
      this.showToastr({
        title: "El formulario no se ha completado.",
        status: "warning",
      });
      return;
    }
   
    const request = this.mainService.post({
      api: `${this.API_ALL}`,
      data:  content.newData,
    });

    request.subscribe(
      response => {
        if (response) {
          if (response.errors) {
            this.handleError({ error: response.message });
          } else {
            this.handleSuccess({ title: "Creado!" });
            if (content) content.confirm.resolve(content.newData);
          }
        } else {
          this.handleResponseNull();
        }
      },
      error => {
        this.handleError({ error });
      },
      () => {}
    );
  }

  /**
   * Actualiza un objeto
   * @param {any} content event smart table
   * @returns void
   */
  public onUpdate({ content }: { content: any }): void {
    if (!content || (content && !content.newData)) {
      this.showToastr({
        title: "Seleccion invalida.",
        status: "warning",
      });
      return;
    }

    const request = this.mainService.put({
      api: `${this.API_ALL}/${content.data._id}`,
      data: content.newData,
    });

    request.subscribe(
      response => {
        if (response) {
          if (response.errors) {
            this.handleError({ error: response.message });
          } else {
            this.handleSuccess({ title: "Actualizado!" });
            if (content) content.confirm.resolve(content.newData);
          }
        } else {
          this.handleResponseNull();
        }
      },
      error => {
        this.handleError({ error });
      }
    );
  }

  /**
   * Elimina un objeto del servidor
   * @param {any} content event smart table
   * @returns void
   */
  public onDelete({ content }: { content: any }): void {
    if (!content) {
      this.showToastr({
        title: "Selecci�n inv�lida.",
        status: "warning",
      });
      return;
    }

    const msn =
      "Se eliminara un objeto. Esta accion no se puede revertir, seguro?";

    if (!confirm(`${msn}`)) {
      return;
    }

    const request = this.mainService.delete({
      api: `${this.API_ALL}/${content.data._id}`,
    });

    request.subscribe(
      response => {
        if (response) {
          if (response.errors) {
            this.handleError({ error: response.message });
          } else {
            this.handleSuccess({ title: "Eliminado!" });
            if (content) content.confirm.resolve(content.newData);
          }
        } else {
          this.handleResponseNull();
        }
      },
      error => {
        this.handleError({ error });
      }
    );
  }

  // =================================
  // Metodos Genericos
  // ================================
 
 
  /**
   * Nebular Smart Table configuration
   * @returns void
   */
  public config(): void {
  
    // configuracion de la Tabla Smart
 		
	this.settings = {
    	pager: {
        	display: true,
        	perPage: 15,
      },
      hideSubHeader: false,
      
      actions: {
        columnTitle: "Opciones",
        add: true,
        filter: true,
        edit: true,
        delete: true,
        position: "left",
      },
     
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
        confirmDelete: true,
      },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
        saveButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
        confirmSave: true,
      },
      add: {
        addButtonContent: '<i class="nb-plus"></i>',
        createButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
        confirmCreate: true,
      },
      mode: "inline",
      columns: {
      		nombre: {
	          title: "Nombre",
	          editable: true,
	          filter: true,
	          width: "11%",
	        },
      		sku: {
	          title: "SKU",
	          editable: false,
	          filter: true,
	          width: "11%",
	        },
      		inventarioActual: {
	          title: "Inventario Actual",
	          editable: true,
	          filter: true,
	          width: "11%",
	        },
      		stockMinimo: {
	          title: "Stock Minimo",
	          editable: true,
	          filter: true,
	          width: "11%",
	        },
      		stockMedio: {
	          title: "Stock Medio",
	          editable: true,
	          filter: true,
	          width: "11%",
	        },
      		stockMaximo: {
	          title: "Stock Maximo",
	          editable: true,
	          filter: true,
	          width: "11%",
	        },
      		unidad: {
	          title: "Unidad",
	          editable: true,
	          filter: true,
	          width: "11%",
	        },
      		reOrden: {
	          title: "Re Orden",
	          editable: true,
	          filter: true,
	          width: "11%",
	        },
      },
    };
  }

  /**
   * Filtra la Samrt Table de modo que solo se muestren las entradas
   * que contienen los caracteres buscados
   * @param  {string=""} query cadena de caracteres a buscar
   * @returns void
   */
  public onSearch({ query }: { query: string }): void {
    if (!query) this.source.reset();
    else {
      this.source.setFilter(
        [
          {
            field: "nombre",
            search: query,
          },
        ],
        false
      );
    }
  }

  /**
   * Muestra una notificacion estilo Toastr en la pantalla actual
   * @param  {string} position determina en que parte de la pantalla se representar� el Toastr
   * @param  {any} title titulo del Toastr
   * @param  {any} message contenido del Toastr
   * @param  {any} status puede ser (basic, primary, success, info, warning, danger, control)
   * @returns void
   */
  public showToastr({
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

  /**
   * Se encarga de navegar a la URL especificada
   * @param {string} path -> "/dashboard/inventario/:id"
   * @return void
   */
  public routerNavigateTo({ path }: { path: string }): void {
    this.router.navigate([path]).then(fulfilled => {
      if (!fulfilled) {
        this.showToastr({
          title: "Direcci�n URL no v�lida.",
          status: "basic",
        });
      }
    });
  }

  /**
   * Abre un dialogo estilo nebular
   * @param  {any} dialog referencia al template en html
   * que contiene el dialogo. Deber�a der tipye ElementRef o TypeReference
   * @returns void
   */
  public showDialog({ dialog }: { dialog: any }): void {
    this.dialogActivo = this.dialogService.open(dialog, { context: "" });
  }
}