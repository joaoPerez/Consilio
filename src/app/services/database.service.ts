import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private storage: SQLiteObject;
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  financas = new BehaviorSubject([]);

  constructor(
    private plt: Platform,
    private sqlite: SQLite,
    private sqlitePorter: SQLitePorter,
    private http: HttpClient) {
    this.init();
  }

  async init() {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'financas.db',
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

  public insert(financa: Financa) {
    let data = [financa.nome, financa.tipo, financa.valor, financa.data_operacao, financa.data_criacao];
    return this.storage.executeSql('INSERT INTO financas (nome, tipo, valor, data_operacao, data_criacao) VALUES (?, ?, ?, ?, ?)', data)
      .then(res => {
        return res.insertId;
      });
  }

  public update(financa: Financa) {
    let data = [financa.nome, financa.tipo, financa.valor, financa.data_operacao, financa.data_criacao];
    return this.storage.executeSql(`UPDATE financas SET nome = ?, tipo = ?, valor = ?, data_operacao = ?, data_criacao = ? WHERE id = ${financa.id}`, data);
  }

  public remove(id: number) {
    return this.storage.executeSql('DELETE FROM financas WHERE id = ?', [id])
      .then(_ => {
        return id;
      });
  }

  public getById(id: number) {
    return this.storage.executeSql('SELECT id, nome, tipo, valor, data_operacao, data_criacao FROM financas WHERE id = ?', [id]).then(res => {
      return {
        id: res.rows.item(0).id,
        nome: res.rows.item(0).nome,
        tipo: res.rows.item(0).tipo,
        valor: res.rows.item(0).valor,
        data_criacao: res.rows.item(0).data_criacao,
        data_operacao: res.rows.item(0).data_operacao
      }
    });
  }

  public getAll() {

    let financas: Financa[] = [];

    return this.storage.executeSql('SELECT id, nome, tipo, valor, data_operacao, data_criacao FROM financas', []).then(res => {
      let items: Financa[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id,
            nome: res.rows.item(i).nome,
            tipo: res.rows.item(i).tipo,
            valor: res.rows.item(i).valor,
            data_criacao: res.rows.item(i).data_criacao,
            data_operacao: res.rows.item(i).data_operacao
          });
        }
      }
      
      this.financas.next(items);
      financas = items;
    }).then(() => {
      return Promise.resolve(financas);
    })
      .catch((error) => {
        return Promise.reject(error);
      });
  }
}

export class Financa {
  id: number;
  nome: string;
  tipo: string;
  valor: number;
  data_criacao: string;
  data_operacao: string;
}