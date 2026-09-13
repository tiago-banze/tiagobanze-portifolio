# Portfólio de Tiago Victor Banze

Site pessoal com backend em Django (API + painel administrativo) e frontend em
HTML5, JavaScript puro e Tailwind CSS (sem frameworks, sem passo de build).

## Estrutura do projeto

```
backend/            Django + Django REST Framework (API e painel /admin)
frontend-static/    Site público (HTML, JS puro, Tailwind via CDN)
```

O frontend nunca guarda dados fixos. Toda a informação (perfil, serviços,
projetos, artigos do blog, certificações) vem da API do Django em tempo real.

## Rodar localmente

### Backend

```
cd backend
py -3.12 -m pip install -r requirements.txt --break-system-packages
py -3.12 manage.py migrate
py -3.12 manage.py createsuperuser
py -3.12 manage.py runserver
```

O backend fica em `http://localhost:8000`. O painel administrativo fica em
`http://localhost:8000/admin/`.

### Frontend

```
cd frontend-static
py -3.12 -m http.server 3000
```

Abra `http://localhost:3000`. A porta 3000 já está autorizada no CORS do
backend por padrão, por isso não precisa mudar nada.

## Migrar os dados de SQLite para PostgreSQL (Neon)

O projeto usa SQLite em desenvolvimento e PostgreSQL em produção, controlado
por uma única variável de ambiente (`DATABASE_URL`). Os dados não se perdem
ao migrar, desde que siga estes passos na ordem certa.

### 1. Exportar os dados do SQLite atual

Dentro de `backend/`, com o `db.sqlite3` atual no lugar:

```
py -3.12 manage.py dumpdata api auth.user --natural-foreign --natural-primary --indent 2 > dados.json
```

Isto cria um ficheiro `dados.json` com todo o conteúdo do site (perfil,
projetos, artigos, certificações, etc.) e o seu utilizador do admin.

### 2. Criar o banco de dados no Neon

1. Crie uma conta em neon.tech (tem plano gratuito).
2. Crie um novo projeto. O Neon gera automaticamente uma string de ligação,
   parecida com:
   `postgres://usuario:senha@ep-exemplo.aws.neon.tech/nomedobanco?sslmode=require`
3. Copie essa string inteira.

### 3. Apontar o backend para o Postgres novo

No ficheiro `.env` dentro de `backend/` (crie a partir de `.env.example` se
ainda não existir), defina:

```
DATABASE_URL=postgres://usuario:senha@ep-exemplo.aws.neon.tech/nomedobanco?sslmode=require
```

### 4. Criar as tabelas no banco novo e importar os dados

```
py -3.12 manage.py migrate
py -3.12 manage.py loaddata dados.json
```

Pronto: o Postgres do Neon agora tem exatamente os mesmos dados que estavam
no SQLite. Pode confirmar entrando no `/admin/` (agora já a usar o Neon) e
verificando se o perfil, os projetos e os artigos continuam lá.

## Publicar no Vercel

O Vercel serve dois projetos separados aqui: o backend (Django, como função
serverless) e o frontend (ficheiros estáticos). São dois deploys distintos.

### Backend

1. Suba a pasta `backend/` para um repositório no GitHub.
2. No Vercel, crie um novo projeto a partir desse repositório.
3. Nas variáveis de ambiente do projeto no Vercel, defina (pelo menos):
   - `DJANGO_SECRET_KEY` (uma chave nova e segura, não a do `.env.example`)
   - `DEBUG=False`
   - `ALLOWED_HOSTS=nome-do-seu-projeto.vercel.app`
   - `DATABASE_URL` (a mesma string de ligação do Neon)
   - `CORS_ALLOWED_ORIGINS=https://nome-do-frontend.vercel.app`
   - `CSRF_TRUSTED_ORIGINS=https://nome-do-frontend.vercel.app`
   - `CLOUDINARY_URL` (ver secção seguinte)
4. Antes de publicar, rode localmente `py -3.12 manage.py collectstatic` e
   confirme que a pasta `backend/staticfiles/` foi criada. Suba essa pasta
   junto no repositório: é o CSS/JS do painel de admin, e o Vercel não sabe
   gerá-la sozinho.
5. Publique. O ficheiro `vercel.json` já incluído na pasta `backend/` diz ao
   Vercel como correr o Django.

### Guardar as imagens e ficheiros enviados (Cloudinary)

O disco do Vercel é temporário: qualquer foto, CV ou certificado que você
envie pelo `/admin/` desaparece no próximo deploy, porque não há disco
permanente numa função serverless. A solução é guardar esses ficheiros num
serviço externo em vez do disco do servidor.

1. Crie uma conta gratuita em cloudinary.com.
2. No painel do Cloudinary, copie a "API Environment variable", algo como:
   `cloudinary://123456789:AbCdEfGh@seu-cloud-name`
3. Cole esse valor na variável `CLOUDINARY_URL` do Vercel.

A partir daí, tudo o que for enviado pelo `/admin/` fica guardado no
Cloudinary automaticamente, sem mudar mais nada no código.

### Frontend

1. Suba a pasta `frontend-static/` para outro repositório no GitHub (ou uma
   subpasta do mesmo, com "Root Directory" apontado para `frontend-static`
   nas definições do projeto Vercel).
2. No Vercel, crie um novo projeto apontando para essa pasta. Não precisa de
   comando de build nem de instalação: são ficheiros estáticos prontos.
3. Depois de publicado, abra `frontend-static/assets/js/shared/api.js` e
   troque a linha:
   ```
   const PRODUCTION_API_BASE = 'https://TROQUE-PELO-SEU-BACKEND.vercel.app/api';
   ```
   pelo endereço real do backend publicado no passo anterior. Suba essa
   alteração e o Vercel publica a versão nova automaticamente.

## Variáveis de ambiente do backend (referência)

| Variável | Para que serve | Exemplo |
|---|---|---|
| `DJANGO_SECRET_KEY` | Chave de segurança interna do Django | uma string aleatória longa |
| `DEBUG` | Modo de depuração (deixe `False` em produção) | `False` |
| `ALLOWED_HOSTS` | Domínios autorizados a servir o backend | `meu-backend.vercel.app` |
| `DATABASE_URL` | Ligação ao banco de dados | string do Neon |
| `CORS_ALLOWED_ORIGINS` | Domínios autorizados a chamar a API | `https://meu-site.vercel.app` |
| `CSRF_TRUSTED_ORIGINS` | Domínios autorizados a enviar formulários | `https://meu-site.vercel.app` |
| `CLOUDINARY_URL` | Guarda ficheiros enviados fora do disco do Vercel | string do Cloudinary |

## Notas

- O backend (Django) e o frontend (HTML/JS puro) são publicados de forma
  independente. Cada um tem o seu próprio endereço .vercel.app.
- O painel administrativo continua sempre em `/admin/` no endereço do
  backend, nunca no do frontend.
- Sempre que o `DATABASE_URL` mudar (por exemplo, de SQLite local para
  Neon), é preciso rodar `py -3.12 manage.py migrate` de novo apontando
  para o banco novo, antes de importar os dados.
