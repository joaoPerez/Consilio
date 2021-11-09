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
  nome: string;
  tipo: string;
  valor: number;
  data_operacao: string;

  constructor(private databaseService: DatabaseService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) {}

  ionViewDidEnter() {
    this.databaseService.getAll()
      .then((result) => {
        this.financas = result;
      });
  }

}
