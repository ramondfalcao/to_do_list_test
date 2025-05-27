# ✅ Todo List App

Aplicação completa de gerenciamento de tarefas com autenticação de usuários, desenvolvida com Nest.js no backend e Next.js no frontend.

---

## 🚀 Tecnologias utilizadas

- Nest.js
- TypeScript
- Prisma
- JWT
- SQLserver
- Next.js
- Jest
- Swagger (documentação)
- ESLint + Prettier (padronização)
- Tailwind
- Lucide-React
---

## 📦 Instalação

Clonar o repositorio:
```bash
git clone git@github.com:ramondfalcao/to_do_list_test.git
```

Execute o comando para subir o serviço Docker de Banco de Dados SQLserver:
```bash
 npm run compose:up
```

```bash
cd to_do_list_test/app/backend
npm install
npm run start:dev // Para Rodar o Backend
```

```bash
cd to_do_list_test/app/frontend
npm install
npm run dev // Para Rodar o Frontend
```

## ⚙️ Variáveis de Ambiente na pasta raiz do Backend
```bash
JWT_SECRET='123123'
DATABASE_URL="sqlserver://localhost:1433;database=master;user=sa;password=YourStrong!Passw0rd;trustServerCertificate=true"
```

## 📚 Documentação Swagger
A documentação da API está disponível após iniciar a aplicação:

🔗 http://localhost:3001/docs

## 🧪 Testes

Obs: Os Testes Unitarios foram implementados apenas para o backend

Para rodar os testes:
```bash
npm test
```


Irá executar os teste dos seguintes arquivos:

```bash
users.service.spec.ts
tasks.service.spec.ts
```