import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CurrencyComponent } from './currency/currency.component';

@Injectable({
  providedIn: 'root'
})
// http-сервис для обмена с backend-ом
export class HttpService {
	private url = 'http://127.0.0.1:5000/api';  // URL для нашего api

	// задаем заголовок http-запроса как содержимое json
	httpOptions = {
    	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  	};

  	constructor(private http: HttpClient) { }

  	// GET-запрос получения списка валют
  	getCurrences(): Observable<any[]> {
  		return this.http.get<any[]>(this.url)
		.pipe(catchError(this.handleError<any[]>()));
	}

  	/** POST-запрос отправки на сервер*/
	getCurrenceRates(result: any[]): Observable<CurrencyComponent> {
		return this.http.post<CurrencyComponent>(this.url, result, this.httpOptions)
		.pipe(catchError(this.handleError<CurrencyComponent>()));
		
	}

	/* обработчик ошибок */
  	private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // вывести ошибку в лог
      return of(result as T);
    };
  }
}