import { Component } from '@angular/core';
import { DatabaseService, Financa } from '../services/database.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  financas: Financa[];
  recebimentosMes = 0;
  gastosMes = 0;
  saldoMes = 0;

  dataInicial;
  mesInicial;
  anoInicial;

  constructor(private databaseService: DatabaseService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) {}

  ngOnInit() {
    this.dataInicial  = new Date()
    this.mesInicial = this.dataInicial.getMonth() + 1
    this.anoInicial = this.dataInicial.getFullYear()
  }

  ionViewDidEnter() {
    this.databaseService.getAll()
      .then((result) => {
        this.financas = result;
        this.calculo()
      });
  }

  calculo() {
    this.saldoMes = 0;
    this.financas.forEach(financa => {
      if(financa.tipo == 'Ganho') {
        this.recebimentosMes = this.recebimentosMes + financa.valor
      } else {
        this.gastosMes = this.gastosMes + financa.valor
      }      
    });

    this.saldoMes = this.recebimentosMes - this.gastosMes;
  }

}
