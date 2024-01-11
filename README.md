# Sistema de Agendamento da Clínica de Consultas Ágil

Bem-vindo ao Sistema de Agendamento da Clínica de Consultas Ágil. Este sistema foi desenvolvido para facilitar o gerenciamento de pacientes, agendamentos e cancelamentos.

## Funcionalidades

### 1. Cadastrar um Paciente
- Permite o cadastro de um novo paciente, incluindo nome e telefone.

### 2. Marcações de Consultas
- Exibe uma lista de pacientes para seleção.
- Solicita informações como data, hora e especialidade para agendar uma consulta.

### 3. Cancelamento de Consultas
- Lista todos os agendamentos existentes.
- Permite o cancelamento de um agendamento selecionado.

### 4. Sair
- Opção para encerrar o sistema.

## Estrutura do Projeto

- **Pacientes**: Diretório que armazena os dados dos pacientes em arquivos JSON.
- **Operações**: Funções dedicadas para cada operação do sistema.
- **Interface do Usuário**: Utilização do pacote `inquirer` para interação via terminal.

## Instruções de Uso

3. Acesse o diretório do projeto:
```bash
cd desafio-aceleradora-agil
```

5. Instale as dependências necessárias:
```bash
npm install
```

## Como Executar

Para iniciar o sistema, execute:
```bash
npm start
```
## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE). Para mais informações, consulte o arquivo LICENSE.
