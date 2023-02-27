- **index.js**: É responsável por chamar todas as camas

- **workers**:
    - Toda lógica **pesada** que envolva CPU
    - Tudo que pode travar a tela (for, ML, AI, processamento de imagem)
    - Processo em segundo plano
    - Ele chama as regras de negócio da *service*

- **services**
    - Lógica de negócio
    - Chamadas externas (API, arquivos, BD)

- **view**:
    - Toda interação com o HTML (DOM)
    - Não possui regras de negócio

- **controllers**
    - É a intermediária entre services e view
    
- **factories**
    - Quem importa as dependências
    - Cria o objeto final para fazer as chamadas
    - Retorna a função que inicializa o fluxo do componente


