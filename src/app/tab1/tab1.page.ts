import { Component } from '@angular/core';
import { Operacoes, StorageService } from '../services/storage.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private storageService: StorageService) {}

  teste() {
    console.log('chegou no operacoes')
    let operacao = new Operacoes();
    operacao.nome = 'teste';
    operacao.tipo = 0;
    operacao.valor = 49;
    operacao.dataInclusao = new Date('10/10/2021');

      this.storageService.insert(operacao)
        .then(async (sucesso) => {
          console.log(sucesso)
          console.log('ta funcionando o insert')
          /*this.exibeToast('Produto adicionado: ' + nome);
          this.nome = undefined;
          this.quant = undefined;
          this.valor = undefined;
          this.ionViewDidEnter();*/
        })
        .catch((error) => {
          console.log('deu ruim no insert')
          //this.exibeToast(error);
        });


        this.storageService.getById(0)
        .then(async (sucesso) => {
          console.log('ta funcionando o get')
          console.log(sucesso)
          /*this.exibeToast('Produto adicionado: ' + nome);
          this.nome = undefined;
          this.quant = undefined;
          this.valor = undefined;
          this.ionViewDidEnter();*/
        })
        .catch((error) => {
          console.log('deu ruim no get')
          //this.exibeToast(error);
        });
   

  }
}
//teste