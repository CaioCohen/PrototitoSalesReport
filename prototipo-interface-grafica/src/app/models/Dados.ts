// Interface para representar as marcas e suas vendas
class Vendas {
    [marca: string]: number[];
  }
  
  // Interface para representar os produtos e suas marcas
  class Produtos {
    [produto: string]: string[];
  }
  
  // Interface para representar as categorias e seus produtos
  class Categoria {
    [categoria: string]: {
      produtos: Produtos;
    };
  }
  
  export class Dados {
    categorias: Categoria;
    vendas: Vendas;
    public constructor(){
        this.categorias = new Categoria();
        this.vendas = new Vendas();
    }
  }
  