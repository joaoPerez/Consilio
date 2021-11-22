import { Component } from '@angular/core';
import { DatabaseService, Financa } from '../services/database.service';
import { Router } from '@angular/router';

import { AlertController, ToastController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  economia_mes_value: number = 0;
  meta_dia_value: string = "";
  media_atual_value: string = "";
  total_ganhos: number = 0;
  total_gastos: number = 0;
  diasMes: number = 0;
  balancoPositivo: boolean;

  constructor(
    private router: Router,
    private databaseService: DatabaseService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) {
    this.diasMes = moment().daysInMonth();
  }

  ionViewWillEnter() {
    this.atualizar();
  }

  atualizar() {
    this.buscaFinancaMes();
    this.media_atual_value = this.calculoMediaAtual();
    this.meta_dia_value = this.calculoMetaDia();
    this.balancoPositivo = this.total_ganhos - this.total_gastos > this.economia_mes_value ? true : false;
    this.total_ganhos = 0;
    this.total_gastos = 0;
  }

  buscaFinancaMes() {
    let financas: Financa[];

    this.databaseService.getAllByActualMonth()
      .then((result) => {
        financas = result;

        financas.forEach(financa => {
          if (financa.tipo == 'Ganho') {
            this.total_ganhos = this.total_ganhos + financa.valor
          } else {
            this.total_gastos = this.total_gastos + financa.valor
          }
        });
      });
  }

  calculoMetaDia() {
    if(this.total_ganhos == 0) return "0";
    return ((this.total_ganhos - this.economia_mes_value) / this.diasMes).toString();
  }

  calculoMediaAtual() {
    if(this.total_gastos == 0) return "0";
    return (this.total_gastos / this.diasMes).toString();
  }
}
