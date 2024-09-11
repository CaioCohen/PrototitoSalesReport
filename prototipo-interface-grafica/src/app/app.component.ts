import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { RouterOutlet } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Dados } from './models/Dados';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  public constructor() {
  }
  categoria: string = "";
  produto: string = "";
  marca: string = "";
  chart: any;
  title = 'prototipo-interface-grafica';
  data: Dados = new Dados();
  isLoading: boolean = false;
  // Inicialização dos selects

  ngOnInit() {
    Chart.register(...registerables); // Registra todos os componentes necessários
    // Inicializar a interface
    this.initializeChart();
    //recuperar os dados
    this.recuperarDados();
  }



  //Função que realiza uma chamada GET HTTP para simular uma chamada à API
  recuperarDados() {
    this.isLoading = true;
    fetch('https://caiocohen.github.io/PrototitoSalesReport/data.json')
      .then(response => response.json())
      .then(dados => {
        this.data = dados;
        console.log(this.data);
        this.categoria = this.getKeys(this.data.categorias)[0];
        this.produto = this.getKeys(this.data.categorias[this.categoria].produtos)[0];
        this.marca = this.data.categorias[this.categoria].produtos[this.produto][0];
        this.isLoading = false;
        this.updateChart();
      })
      .catch(error => console.error('Erro ao recuperar os dados:', error));
  }

  selectCategoria(){
    this.produto = this.getKeys(this.data.categorias[this.categoria].produtos)[0];
    this.marca = this.data.categorias[this.categoria].produtos[this.produto][0];
    this.updateChart();
  }

  // Preencher produtos com base na categoria selecionada
  selectProduto(){
    this.marca = this.data.categorias[this.categoria].produtos[this.produto][0];
    this.updateChart();
  }

  selectMarca(){
    this.updateChart();
  }

  initializeChart() {
    const element = document.getElementById('sales-chart');
    let ctx: any;
    if (element) {
      ctx = (element as HTMLCanvasElement).getContext('2d');
      if (ctx) {
        // Now you can safely use ctx
      } else {
        // Handle the case where getContext returns null
        console.error('Failed to get 2D context');
      }
    } else {
      // Handle the case where the element is not found
      console.error('Element with id "sales-chart" not found');
    }
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril'],
        datasets: [{
          label: 'Vendas',
          data: [],
          borderColor: 'rgba(0, 98, 255)',
          backgroundColor: 'rgba(117, 170, 255)',
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Atualizar gráfico de vendas
  updateChart() {
    if (this.chart) {
      const salesData = this.data.vendas[this.marca] || [];
      this.chart.data.datasets[0].data = salesData;
      this.chart.update();
    }
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

}

