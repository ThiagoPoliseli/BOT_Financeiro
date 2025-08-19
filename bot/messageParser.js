class MessageParser {
  constructor() {
    // Sistema de categorias e subcategorias mais específico e detalhado
    this.categorySystem = {
      'alimentação': {
        subcategories: {
          'refeições': ['almoço', 'jantar', 'café da manhã', 'lanche', 'ceia', 'brunch'],
          'restaurantes': ['restaurante', 'lanchonete', 'pizzaria', 'hamburgueria', 'delivery', 'ifood', 'uber eats', 'rappi'],
          'mercado': ['mercado', 'supermercado', 'hipermercado', 'feira', 'açougue', 'padaria', 'compras', 'sacolão'],
          'bebidas': ['bebida', 'cerveja', 'refrigerante', 'água', 'suco', 'café', 'chá', 'energético'],
          'doces': ['doce', 'chocolate', 'sorvete', 'bolo', 'torta', 'açaí', 'sobremesa', 'brigadeiro']
        }
      },
      'transporte': {
        subcategories: {
          'combustível': ['gasolina', 'álcool', 'diesel', 'combustível', 'posto', 'etanol', 'gnv'],
          'transporte público': ['ônibus', 'metro', 'trem', 'brt', 'passagem', 'bilhete único', 'cartão transporte'],
          'aplicativos': ['uber', 'taxi', '99', 'cabify', 'pop', 'blablacar'],
          'estacionamento': ['estacionamento', 'zona azul', 'valet', 'parking', 'garagem'],
          'manutenção': ['mecânico', 'oficina', 'pneu', 'óleo', 'revisão', 'lavagem', 'conserto carro'],
          'outros transportes': ['pedágio', 'viagem', 'avião', 'rodoviária', 'aeroporto', 'passagem aérea']
        }
      },
      'casa': {
        subcategories: {
          'contas básicas': ['luz', 'energia elétrica', 'água', 'esgoto', 'gás', 'conta de luz', 'conta de água', 'conta de gás', 'energia'],
          'comunicação': ['internet', 'telefone', 'celular', 'tv a cabo', 'streaming', 'netflix', 'spotify', 'amazon prime'],
          'moradia': ['aluguel', 'condomínio', 'iptu', 'seguro residencial', 'financiamento', 'prestação casa'],
          'limpeza': ['limpeza', 'detergente', 'sabão', 'papel higiênico', 'produtos de limpeza', 'desinfetante'],
          'móveis e decoração': ['móvel', 'decoração', 'eletrodoméstico', 'utensílios', 'cama', 'mesa', 'sofá'],
          'manutenção': ['reforma', 'pintura', 'encanador', 'eletricista', 'conserto', 'ferramenta', 'pedreiro']
        }
      },
      'saúde': {
        subcategories: {
          'consultas': ['médico', 'consulta', 'dentista', 'psicólogo', 'fisioterapeuta', 'nutricionista', 'cardiologista'],
          'medicamentos': ['farmácia', 'remédio', 'medicamento', 'vitamina', 'suplemento', 'antibiótico'],
          'exames': ['exame', 'laboratório', 'raio x', 'ultrassom', 'ressonância', 'tomografia', 'sangue'],
          'planos': ['plano de saúde', 'seguro saúde', 'convênio médico', 'unimed', 'bradesco saúde'],
          'emergência': ['hospital', 'pronto socorro', 'ambulância', 'emergência', 'upa'],
          'bem-estar': ['academia', 'personal trainer', 'massagem', 'spa', 'pilates', 'yoga']
        }
      },
      'lazer': {
        subcategories: {
          'entretenimento': ['cinema', 'teatro', 'show', 'concerto', 'espetáculo', 'festival', 'evento'],
          'vida noturna': ['bar', 'balada', 'festa', 'pub', 'choperia', 'night club'],
          'jogos': ['jogo', 'game', 'playstation', 'xbox', 'nintendo', 'steam', 'epic games'],
          'streaming': ['netflix', 'amazon prime', 'disney+', 'spotify', 'youtube premium', 'globoplay'],
          'viagens': ['viagem', 'hotel', 'pousada', 'turismo', 'passeio', 'excursão', 'airbnb'],
          'hobbies': ['hobby', 'livro', 'revista', 'curso', 'workshop', 'artesanato']
        }
      },
      'educação': {
        subcategories: {
          'cursos': ['curso', 'faculdade', 'universidade', 'pós-graduação', 'mestrado', 'doutorado'],
          'materiais': ['livro', 'apostila', 'material escolar', 'caderno', 'caneta', 'mochila'],
          'online': ['udemy', 'coursera', 'alura', 'curso online', 'ead', 'hotmart'],
          'idiomas': ['inglês', 'espanhol', 'francês', 'alemão', 'idioma', 'wizard', 'ccaa']
        }
      },
      'trabalho': {
        subcategories: {
          'equipamentos': ['notebook', 'computador', 'mouse', 'teclado', 'monitor', 'impressora'],
          'software': ['software', 'licença', 'adobe', 'microsoft office', 'antivírus', 'windows'],
          'transporte trabalho': ['combustível trabalho', 'estacionamento trabalho', 'uber trabalho', 'ônibus trabalho'],
          'alimentação trabalho': ['almoço trabalho', 'lanche trabalho', 'café trabalho', 'vale refeição']
        }
      },
      'vestuário': {
        subcategories: {
          'roupas': ['roupa', 'camisa', 'calça', 'vestido', 'saia', 'blusa', 'jaqueta'],
          'calçados': ['sapato', 'tênis', 'sandália', 'bota', 'chinelo', 'sapatilha'],
          'acessórios': ['bolsa', 'carteira', 'cinto', 'óculos', 'relógio', 'joia', 'perfume'],
          'cuidados': ['lavanderia', 'costureira', 'sapateiro', 'tinturaria']
        }
      },
      'outros': {
        subcategories: {
          'diversos': ['presente', 'doação', 'multa', 'taxa', 'imposto', 'cartório'],
          'emergência': ['emergência', 'imprevisto', 'urgência', 'socorro'],
          'investimentos': ['investimento', 'poupança', 'ação', 'fundo', 'tesouro direto']
        }
      }
    };
  }

  parseExpenseMessage(message) {
    if (!message || typeof message !== 'string') {
      return null;
    }

    const text = message.trim().toLowerCase();
    
    // Padrões para extrair valor, descrição e categoria
    const patterns = [
      // "50 almoço alimentação" ou "R$ 50,00 almoço alimentação"
      /(?:r\$\s*)?(\d+(?:[\.,]\d{1,2})?)\s+(.+?)\s+(alimentação|transporte|casa|saúde|lazer|educação|trabalho|vestuário|outros)/i,
      // "50 almoço" ou "R$ 50,00 almoço"
      /(?:r\$\s*)?(\d+(?:[\.,]\d{1,2})?)\s+(.+)/i,
      // "almoço 50 alimentação" ou "almoço R$ 50,00 alimentação"
      /(.+?)\s+(?:r\$\s*)?(\d+(?:[\.,]\d{1,2})?)\s+(alimentação|transporte|casa|saúde|lazer|educação|trabalho|vestuário|outros)/i,
      // "almoço 50" ou "almoço R$ 50,00"
      /(.+?)\s+(?:r\$\s*)?(\d+(?:[\.,]\d{1,2})?)\s*$/i,
    ];

    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      const match = text.match(pattern);
      
      if (match) {
        let value, description, category;
        
        if (i === 0) { // "50 almoço alimentação"
          value = this.parseValue(match[1]);
          description = match[2].trim();
          category = match[3].toLowerCase();
        } else if (i === 1) { // "50 almoço"
          value = this.parseValue(match[1]);
          description = match[2].trim();
          const result = this.autoCategorizе(description);
          category = result.category;
        } else if (i === 2) { // "almoço 50 alimentação"
          description = match[1].trim();
          value = this.parseValue(match[2]);
          category = match[3].toLowerCase();
        } else { // "almoço 50"
          description = match[1].trim();
          value = this.parseValue(match[2]);
          const result = this.autoCategorizе(description);
          category = result.category;
        }
        
        // Validar se o valor é válido e a descrição não está vazia
        if (!isNaN(value) && value > 0 && description && description.length > 0) {
          const result = this.autoCategorizе(description);
          return {
            value: parseFloat(value.toFixed(2)),
            description: this.cleanDescription(description),
            category: category === 'outros' ? result.category : category,
            subcategory: result.subcategory
          };
        }
      }
    }
    
    return null;
  }

  parseValue(valueStr) {
    if (!valueStr) return NaN;
    
    // Remove espaços e converte vírgula para ponto
    const cleaned = valueStr.toString().replace(/\s/g, '').replace(',', '.');
    return parseFloat(cleaned);
  }

  autoCategorizе(description) {
    if (!description) return { category: 'outros', subcategory: 'diversos' };
    
    const desc = description.toLowerCase();
    
    // Verificar cada categoria e subcategoria
    for (const [categoryName, categoryInfo] of Object.entries(this.categorySystem)) {
      for (const [subcategoryName, keywords] of Object.entries(categoryInfo.subcategories)) {
        for (const keyword of keywords) {
          if (desc.includes(keyword)) {
            return {
              category: categoryName,
              subcategory: subcategoryName
            };
          }
        }
      }
    }
    
    return {
      category: 'outros',
      subcategory: 'diversos'
    };
  }

  validateCategory(category) {
    const validCategories = ['alimentação', 'transporte', 'casa', 'saúde', 'lazer', 'educação', 'trabalho', 'vestuário', 'outros'];
    return validCategories.includes(category) ? category : 'outros';
  }

  cleanDescription(description) {
    if (!description) return '';
    
    return description
      .trim()
      .replace(/\s+/g, ' ') // Remove espaços extras
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase()); // Primeira letra maiúscula
  }

  // Método para testar o parser
  test() {
    const testCases = [
      "50 almoço",
      "R$ 120,50 mercado alimentação",
      "conta de luz 150",
      "gasolina 85 transporte",
      "25.90 café",
      "uber 35",
      "netflix 30 lazer",
      "150,00 consulta médico saúde",
      "cinema 25 lazer"
    ];

    console.log('🧪 Testando MessageParser com categorias específicas:');
    testCases.forEach(test => {
      const result = this.parseExpenseMessage(test);
      console.log(`"${test}" -> `, result);
    });
  }
}

export default MessageParser;