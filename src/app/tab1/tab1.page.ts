import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

import { DatabaseService, Financa } from '../services/database.service';
import { Router } from '@angular/router';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  financas: Financa[];
  nome: string;
  tipo: string;
  valor: number;
  data_operacao: string;

  constructor(
    private router: Router,
    private databaseService: DatabaseService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) {
  }

  ionViewDidEnter() {
    this.databaseService.getAll()
      .then((result) => {
        this.financas = result;
      });
  }

  adicionar() {
    if (this.nome == undefined) {
      this.exibeAlert('O campo nome não pode ser vazio');
    } else if (this.tipo == undefined) {
      this.exibeAlert('O campo tipo não pode ser vazio');
    }
    else if (this.valor == undefined) {
      this.exibeAlert('O campo valor não pode ser vazio');
    }
    else if (this.data_operacao == undefined) {
      this.exibeAlert('O campo data não pode ser vazio');
    }
    else {
      let nome = this.nome;
      let tipo = this.tipo;
      let valor = this.valor;
      let data_operacao = this.data_operacao;

      let financa = new Financa();
      financa.nome = nome;
      financa.tipo = tipo;
      financa.valor = valor;
      financa.data_operacao = data_operacao;

      this.databaseService.insert(financa)
        .then(async () => {
          this.exibeToast('Operação adicionada: ' + nome);
          this.nome = undefined;
          this.tipo = undefined;
          this.valor = undefined;
          this.data_operacao = undefined;
          this.ionViewDidEnter();
        })
        .catch((error) => {
          this.exibeToast(error);
        });
    }
  }

  excluir(id: number) {
    this.databaseService.remove(id)
      .then(async () => {
        this.ionViewDidEnter();
        this.exibeToast("Operação excluída");
      })
      .catch((error) => {
        this.exibeToast(error);
      });
  }

  async exibeAlert(text: string) {
    const alert = await this.alertCtrl.create({
      header: 'Erro',
      subHeader: 'Lista',
      message: text,
      buttons: ['Fechar']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async exibeToast(text: string) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }

}
//teste