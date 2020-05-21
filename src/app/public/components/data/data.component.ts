import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subscription, forkJoin } from "rxjs";
import { LocalDataSource } from "ng2-smart-table";
import { MainService } from "src/app/service/main.service";
import { NbToastrService, NbDialogService } from "@nebular/theme";
import { FormGroupDirective } from "@angular/forms";
import { FormGroup, FormControl } from "@angular/forms"; //imports

@Component({
  selector: "app-data",
  templateUrl: "./data.component.html",
  //styleUrls: ["./data.component.scss"],
})
export class DataComponent implements OnInit {
  /* Manejo de Usuario */
  public user: any = {};

  /* Titulo en HTML */
  public titulo = "Importar CSV";

  /* Indica el estado de carga */
  public cargando: boolean = false;

  public api: any = { route: "insumos" };

  /* Child Refs */
  @ViewChild("csvReader") csvReader: any;

  constructor(
    //  private authService: AuthService,
    private mainService: MainService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private router: Router
  ) {}

  ngOnInit() {}

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
  // ===============================

  public onUpload({ content }: { content: any }): void {
    let files = content.srcElement.files;
    if (!files.length) return;

    if (this.isValidCSVFile({ file: files[0] })) {
      let input = content.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray({
          csvRecordsArr: csvRecordsArray,
        });

        let records: any[] = this.getDataRecordsArrayFromCSVFile({
          csvRecordsArray: csvRecordsArray,
          headerLength: headersRow.length,
        });

        // persiste
        let observables: Observable<any>[] = [];
        records.forEach((data) => {
          let obs = this.onCreate({ data, api: `api/${this.api.route}` });
          if (obs) observables.push(obs);
        });

        this.forkJoinCreate({ observables });
      };

      reader.onerror = () => {
        this.showToastr({ title: "Error uploading.", status: "danger" });
      };
    } else {
      this.showToastr({ title: "Only CSV Files!.", status: "warning" });
      this.fileReset();
    }
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
   * Crea un objeto usando la msmart table
   * @param {content} value del formulario en Smart Table
   * @returns void
   */
  private onCreate({ data, api }: { data: any; api: string }): Observable<any> {
    if (!(data && api)) return undefined;

    const request = this.mainService.post({
      api: `${api}`,
      data,
    });

    return request;
  }

  private forkJoinCreate({
    observables,
  }: {
    observables: Observable<any>[];
  }): void {
    forkJoin(observables).subscribe(
      (next) => {
        if (next) {
          next.forEach((response) => {
            if (response) {
              if (response._id) this.handleSuccess({ title: "Creado!" });
              else this.handleError({ error: response.message });
            } else this.handleResponseNull();
          });
        } else {
          this.handleResponseNull();
        }
      },
      (error) => this.handleError({ error }),
      () => this.fileReset()
    );
  }


  // =================================
  // Metodos Genericos
  // ================================

  private getDataRecordsArrayFromCSVFile({
    csvRecordsArray,
    headerLength,
  }: {
    csvRecordsArray: any;
    headerLength: any;
  }) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(",");
      if (curruntRecord.length == headerLength) {
        // dinamico
        
        if (this.api.route === "insumos") {
          let csvRecord: any = this.objectInsumos({ curruntRecord });
          csvArr.push(csvRecord);
        }
        if (this.api.route === "proveedores") {
          let csvRecord: any = this.objectProveedores({ curruntRecord });
          csvArr.push(csvRecord);
        }
        if (this.api.route === "productos") {
          let csvRecord: any = this.objectProductos({ curruntRecord });
          csvArr.push(csvRecord);
        }
        if (this.api.route === "ordenesdecompra") {
          let csvRecord: any = this.objectOrdenesDeCompra({ curruntRecord });
          csvArr.push(csvRecord);
        }
        
      }
    }
    
    return csvArr;
  }

  // =================================
  //OBJETO CONSTRUCTOR A PERSITIR
  // ================================

  /**
   * DINAMICO
   * @param param0 
   */
   	
   	
   	  private objectInsumos({
	    curruntRecord,
	  }: {
	    curruntRecord: any[];
	  }): any {
	    // dependen de los atributos
	    let csvRecord: any = {};
	    
	    // dinamico
	    
	    csvRecord.nombre = curruntRecord[0].trim();
	    csvRecord.sku = curruntRecord[1].trim();
	    csvRecord.inventarioActual = curruntRecord[2].trim();
	    csvRecord.stockMinimo = curruntRecord[3].trim();
	    csvRecord.stockMedio = curruntRecord[4].trim();
	    csvRecord.stockMaximo = curruntRecord[5].trim();
	    csvRecord.unidad = curruntRecord[6].trim();
	    csvRecord.reOrden = curruntRecord[7].trim();
	    // estatico
	    return csvRecord;
	  }
  
   	
   	
   	  private objectProveedores({
	    curruntRecord,
	  }: {
	    curruntRecord: any[];
	  }): any {
	    // dependen de los atributos
	    let csvRecord: any = {};
	    
	    // dinamico
	    
	    csvRecord.razonSocial = curruntRecord[0].trim();
	    csvRecord.nit = curruntRecord[1].trim();
	    csvRecord.direccion = curruntRecord[2].trim();
	    csvRecord.telefono = curruntRecord[3].trim();
	    csvRecord.ordenesEnProceso = curruntRecord[4].trim();
	    csvRecord.ordenesCompletadas = curruntRecord[5].trim();
	    // estatico
	    return csvRecord;
	  }
  
   	
   	
   	  private objectProductos({
	    curruntRecord,
	  }: {
	    curruntRecord: any[];
	  }): any {
	    // dependen de los atributos
	    let csvRecord: any = {};
	    
	    // dinamico
	    
	    csvRecord.nombre = curruntRecord[0].trim();
	    csvRecord.inventarioActual = curruntRecord[1].trim();
	    csvRecord.insumos = curruntRecord[2].trim();
	    // estatico
	    return csvRecord;
	  }
  
   	
   	
   	  private objectOrdenesDeCompra({
	    curruntRecord,
	  }: {
	    curruntRecord: any[];
	  }): any {
	    // dependen de los atributos
	    let csvRecord: any = {};
	    
	    // dinamico
	    
	    csvRecord.recibido = curruntRecord[0].trim();
	    csvRecord.insumos = curruntRecord[1].trim();
	    csvRecord.descripcion = curruntRecord[2].trim();
	    csvRecord.ajustada = curruntRecord[3].trim();
	    csvRecord.anulada = curruntRecord[4].trim();
	    csvRecord.fechaLlegada = curruntRecord[5].trim();
	    csvRecord.valorTotal = curruntRecord[6].trim();
	    // estatico
	    return csvRecord;
	  }
  
   	
   

  

  // =================================
  //VALIDACION DE ARCHIVO
  // ================================

  private isValidCSVFile({ file }: { file: any }) {
    if (!file) return false;
    return (file.name as string).endsWith(".csv");
  }

  private getHeaderArray({ csvRecordsArr }: { csvRecordsArr: any }) {
    let headers = (<string>csvRecordsArr[0]).split(",");
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  private fileReset() {
    this.csvReader.nativeElement.value = "";
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
    this.router.navigate([path]).then((fulfilled) => {
      if (!fulfilled) {
        this.showToastr({
          title: "Direcci�n URL no v�lida.",
          status: "basic",
        });
      }
    });
  }
}
