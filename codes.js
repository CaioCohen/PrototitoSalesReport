// Mock data em formato JSON
let data;
let isLoading = false;

// Inicialização dos selects
const categorySelect = document.getElementById('category-select');
const productSelect = document.getElementById('product-select');
const brandSelect = document.getElementById('brand-select');

//Função que realiza uma chamada GET HTTP para simular uma chamada à API
function recuperarDados() {
    fetch('https://caiocohen.github.io/PrototitoSalesReport/data.json')
        .then(response => response.json())
        .then(dados => {
            data = dados;
            console.log(data);
            preencherCategorias();
            preencherProdutos(Object.keys(data.categorias)[0]);
        })
        .catch(error => console.error('Erro ao recuperar os dados:', error));
}

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
recuperarDados();

