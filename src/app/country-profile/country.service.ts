import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from './country';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private baseURL = environment.countryServiceUrl;

  constructor(private httpClient: HttpClient) { }

  getCountryById(id: number): Observable<Country>{
    return this.httpClient.get<Country>(`${this.baseURL}/${id}`);
  }

}
