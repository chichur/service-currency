import { Component, OnInit, ApplicationRef } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../http.service';

interface Card {
  code: string;
  name: string;
  date1: string;
  date2: string;
  cur_date1: number;
  cur_date2: number;
  diff: number;
}

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {

	app;
	currencyForm;
	selectedValue: string;
	card: Card = {
		code: '',
		name: '',
		date1: '',
		date2: '',
		cur_date1: null,
		cur_date2: null,
		diff: null,
	};
	currs: any[];
	curr1;
	curr2;
	diff;
	raise;
	done;


	constructor(appRef: ApplicationRef, private formBuilder: FormBuilder, private httpService: HttpService) {
		this.currencyForm = this.formBuilder.group({
  			currency: ['', [Validators.required]],
  			date1: ['', [Validators.required]],
  			date2: ['', [Validators.required]]
  			}, );
		this.app = appRef;
		this.httpService.getCurrences().subscribe(currs => this.currs = currs);
	}

	ngOnInit(): void {
	}

	onSubmit(data): void {
  		this.card.code = this.currencyForm.value.currency.code;
  		this.card.name = this.currencyForm.value.currency.name;
  		let date1 = this.currencyForm.value.date1;
  		let date2 = this.currencyForm.value.date2;
		date1 = formatDate(date1, 'yyyy-MM-dd','en');
		date2 = formatDate(date2, 'yyyy-MM-dd','en');
  		this.card.date1 = date1;
  		this.card.date2 = date2;
  		this.app.tick();

      	var sendData = [this.card.code,
      					this.card.date1,
      					this.card.date2]
  		this.httpService.getCurrenceRates(sendData).subscribe( (value: CurrencyComponent) => {
  			this.curr1 = value.curr1;
  			this.curr2 = value.curr2;
  			this.diff = value.diff;
  			this.raise = value.raise;
  			this.done = true;
  		},
        error => {
            // error - объект ошибки
        });;
  	}
}
