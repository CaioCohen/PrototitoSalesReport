import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Dados } from './models/Dados';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
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
    fetch('https://caiocohen.github.io/PrototitoSalesReport/data.json')
      .then(response => response.json())
      .then(dados => {
        this.data = dados;
        console.log(this.data);
        this.preencherCategorias();
        this.preencherProdutos(Object.keys(this.data.categorias)[0]);
      })
      .catch(error => console.error('Erro ao recuperar os dados:', error));
  }

  // Preencher categorias
  preencherCategorias() {
    Object.keys(this.data?.categorias).forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      this.categorySelect.appendChild(option);
    });
  }

  // Preencher produtos com base na categoria selecionada
  preencherProdutos(category: any) {
    this.productSelect.innerHTML = '';
    const products = this.data?.categorias[category]?.produtos || {};
    Object.keys(products).forEach(product => {
      const option = document.createElement('option');
      option.value = product;
      option.textContent = product;
      this.productSelect.appendChild(option);
    });
    this.preencherMarcas(this.productSelect.value);
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
    this.updateChart(this.brandSelect.value);
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
  updateChart(brand: any) {
    if (this.chart) {
      const salesData = this.data.vendas[brand] || [];
      this.chart.data.datasets[0].data = salesData;
      this.chart.update();
    }
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

