// Mock data em formato JSON
const data = {
    "categorias": {
      "Eletrônicos": {
        "produtos": {
          "Celulares": ["Marca A", "Marca B", "Marca C"],
          "Notebooks": ["Marca D", "Marca E"]
        }
      },
      "Roupas": {
        "produtos": {
          "Camisetas": ["Marca F", "Marca G"],
          "Calças": ["Marca H", "Marca I"]
        }
      }
    },
    "vendas": {
      "Marca A": [100, 150, 130, 120],
      "Marca B": [80, 90, 100, 95],
      "Marca C": [60, 70, 85, 90],
      "Marca D": [120, 110, 115, 130],
      "Marca E": [140, 135, 120, 125],
      "Marca F": [90, 85, 95, 100],
      "Marca G": [75, 80, 85, 90],
      "Marca H": [100, 110, 105, 120],
      "Marca I": [85, 90, 95, 100]
    }
  };
  
  // Inicialização dos selects
  const categorySelect = document.getElementById('category-select');
  const productSelect = document.getElementById('product-select');
  const brandSelect = document.getElementById('brand-select');
  
  // Preencher categorias
  function preencherCategorias() {
    Object.keys(data.categorias).forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
  }
  
  // Preencher produtos com base na categoria selecionada
  function preencherProdutos(category) {
    productSelect.innerHTML = '';
    const products = data.categorias[category]?.produtos || {};
    Object.keys(products).forEach(product => {
      const option = document.createElement('option');
      option.value = product;
      option.textContent = product;
      productSelect.appendChild(option);
    });
    preencherMarcas(productSelect.value);
  }
  
  // Preencher marcas com base no produto selecionado
  function preencherMarcas(product) {
    brandSelect.innerHTML = '';
    const selectedCategory = categorySelect.value;
    const brands = data.categorias[selectedCategory]?.produtos[product] || [];
    brands.forEach(brand => {
      const option = document.createElement('option');
      option.value = brand;
      option.textContent = brand;
      brandSelect.appendChild(option);
    });
    updateChart(brandSelect.value);
  }
  
  // Inicialização do gráfico
  let chart;
  function initializeChart() {
    const ctx = document.getElementById('sales-chart').getContext('2d');
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril'],
        datasets: [{
          label: 'Vendas',
          data: [],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 1
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
  function updateChart(brand) {
    if (chart) {
      const salesData = data.vendas[brand] || [];
      chart.data.datasets[0].data = salesData;
      chart.update();
    }
  }
  
  // Eventos para os selects
  categorySelect.addEventListener('change', () => {
    preencherProdutos(categorySelect.value);
  });
  
  productSelect.addEventListener('change', () => {
    preencherMarcas(productSelect.value);
  });
  
  brandSelect.addEventListener('change', () => {
    updateChart(brandSelect.value);
  });
  
  // Inicializar a interface
  initializeChart();
  preencherCategorias();
  preencherProdutos(Object.keys(data.categorias)[0]);
  