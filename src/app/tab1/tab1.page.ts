import { Component } from '@angular/core';
import { Produto, StorageService } from '../services/storage.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private storageService: StorageService) {}

  teste() {
    console.log('chegou no produto')
    let produto = new Produto();
      produto.nome = 'teste';
      produto.quant = 3;
      produto.valor = 49;

      this.storageService.insert(produto)
        .then(async () => {
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


        this.storageService.getById(1)
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
