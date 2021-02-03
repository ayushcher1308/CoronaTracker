import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http:HttpClient) { }

  getData(){
    return this.http.get<any>("https://corona-api.com/countries");
  }

  getDataCountry(countryCode:any){
    return this.http.get<any>("https://corona-api.com/countries/"+countryCode);
  }

}
