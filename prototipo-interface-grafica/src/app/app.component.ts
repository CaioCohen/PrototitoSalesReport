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
    this.categorySelect = document.getElementById('category-select');
    this.productSelect = document.getElementById('product-select');
    this.brandSelect = document.getElementById('brand-select');
  }
  categorySelect: any;
  categoria: string = "";
  produto: string = "";
  marca: string = "";
  productSelect: any;
  chart: any;
  brandSelect: any;
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

        //this.preencherCategorias();
        //this.preencherProdutos(Object.keys(this.data.categorias)[0]);
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

  // Preencher marcas com base no produto selecionado
  preencherMarcas(product: any) {
    this.brandSelect.innerHTML = '';
    const selectedCategory = this.categorySelect.value;
    const brands = this.data.categorias[selectedCategory]?.produtos[product] || [];
    brands.forEach((brand: string) => {
      const option = document.createElement('option');
      option.value = brand;
      option.textContent = brand;
      this.brandSelect.appendChild(option);
    });
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

// // Eventos para os selects
// categorySelect.addEventListener('change', () => {
//   preencherProdutos(categorySelect.value);
// });

// productSelect.addEventListener('change', () => {
//   preencherMarcas(productSelect.value);
// });

// brandSelect.addEventListener('change', () => {
//   updateChart(brandSelect.value);
// });

}

