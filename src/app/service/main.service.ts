import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MainService {
  readonly BASE_URL = "https://miso4202-back.herokuapp.com";
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders();
    const token = localStorage.getItem("id_token") || "";
    this.headers.append("Content-Type", "application/json");
    this.headers.append("access-token", token);
  }

  /**
   * API Generico GET
   * @param {string} api route: api/componente
   * @return {Observable<any>} respuesta asincronica
   */
  get({ api }: { api: String }): Observable<any> {
    return this.http.get(`${this.BASE_URL}/${api}`, { headers: this.headers });
  }

  /**
   * API Generico POST
   * @param {string} api route: api/componente
   * @param {any} data objeto a persistir
   * @return {Observable<any>} respuesta asincr�nica
   */
  post({ api, data }: { api: String; data: any }): Observable<any> {
    return this.http.post(`${this.BASE_URL}/${api}`, data, {
      headers: this.headers,
    });
  }

  /**
   * API Generico DELETE
   * @param {string} api route: api/componente/id
   * @return {Observable<any>} respuesta asincr�nica
   */
  delete({ api }: { api: String }): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${api}`, {
      headers: this.headers,
    });
  }

  /**
   * API Generico PUT
   * @param {string} api route: api/componente/id
   * @param {any} data propiedades a actualizar
   * @return {Observable<any>} respuesta asincr�nica
   */
  put({ api, data }: { api: String; data: any }): Observable<any> {
    return this.http.put(`${this.BASE_URL}/${api}`, JSON.stringify(data), {
      headers: this.headers,
    });
  }
}
