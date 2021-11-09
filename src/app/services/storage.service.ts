import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})


export class StorageService {

  private storage: SQLiteObject;
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  produtos = new BehaviorSubject([]);

  constructor(
    private plt: Platform,
    private sqlite: SQLite,
    private sqlitePorter: SQLitePorter,
    private http: HttpClient) {
    this.init();
  }

  async init() {
    console.log('inicialou')
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'produtos.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.storage = db;
          this.dataBase();
        });
    });
  }

  dataBase() {
    this.http.get('assets/banco.sql', { responseType: 'text' })
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.storage, sql)
          .then(_ => {
            this.getAll();
            this.isDbReady.next(true);
          })
          .catch(e => console.error(e));
      });

  }

  public insert(produto: Produto) {
    let data = [produto.nome, produto.quant, produto.valor];
    return this.storage.executeSql('INSERT INTO produtos (nome, quantidade, valor) VALUES (?, ?, ?)', data)
      .then(res => {
        return res.insertId;
      });
  }

  public update(produto: Produto) {
    let data = [produto.nome, produto.quant, produto.valor];
    return this.storage.executeSql(`UPDATE produtos SET nome = ?, quantidade = ?, valor = ? WHERE id = ${produto.id}`, data);
  }

  public remove(id: number) {
    return this.storage.executeSql('DELETE FROM produtos WHERE id = ?', [id])
      .then(_ => {
        return id;
      });
  }

  public getById(id: number) {
    return this.storage.executeSql('SELECT id, nome, quantidade, valor FROM produtos WHERE id = ?', [id]).then(res => {
      return {
        id: res.rows.item(0).id,
        nome: res.rows.item(0).nome,
        quant: res.rows.item(0).quant,
        valor: res.rows.item(0).valor
      }
    });
  }

  public getAll() {

    let produtos: Produto[] = [];

    return this.storage.executeSql('SELECT id, nome, quantidade, valor FROM produtos', []).then(res => {
      let items: Produto[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id,
            nome: res.rows.item(i).nome,
            quant: res.rows.item(i).quantidade,
            valor: res.rows.item(i).valor
          });
        }
      }
      this.produtos.next(items);
      produtos = items;
    }).then(() => {
      return Promise.resolve(produtos);
    })
      .catch((error) => {
        return Promise.reject(error);
      });
  }
}

export class Produto {
  id: number;
  nome: string;
  quant: number;
  valor: number;
}