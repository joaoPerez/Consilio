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

  mesSelecionado = "";
  anoSelecionado = "";

  dataInicial;
  mesInicial;
  anoInicial;

  constructor(private databaseService: DatabaseService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) { }

  ngOnInit() {
    this.dataInicial = new Date()
    this.mesInicial = this.dataInicial.getMonth() + 1
    this.anoInicial = this.dataInicial.getFullYear()
  }

  ionViewDidEnter() {
    this.financas = [];
    this.databaseService.getAll()
      .then((result) => {
        this.financas = result;
        this.calculo();
      });
  }

  buscaFinancaMesAno() {
    this.financas = [];
    let financas: Financa[];

    if (this.mesSelecionado != "" && this.anoSelecionado != "") {

      this.databaseService.getAllByMonthAndYear(this.mesSelecionado, this.anoSelecionado)
        .then((result) => {
          this.financas = result;
          this.calculo();
        });
    }
  }

  addMes(mes: string) {
    this.mesSelecionado = mes;
  }

  addAno(ano: string) {
    this.anoSelecionado = ano;
  }

  calculo() {
    this.saldoMes = 0;
    this.financas.forEach(financa => {
      if (financa.tipo == 'Ganho') {
        this.recebimentosMes = this.recebimentosMes + financa.valor
      } else {
        this.gastosMes = this.gastosMes + financa.valor
      }
    });

    this.saldoMes = this.recebimentosMes - this.gastosMes;
  }

}
