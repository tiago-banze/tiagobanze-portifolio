# Portefólio de Tiago Victor Banze

Site pessoal com backend em Django (API e painel de administração) e frontend em HTML, CSS e JavaScript simples, sem frameworks e sem passo de build.

```
backend/            Django + Django REST Framework (API e painel /admin)
frontend-static/    o site público
```

O site não guarda dados fixos. Tudo (perfil, serviços, projetos, artigos, certificados) vem da API do Django.

## Correr no teu computador

Backend:

```
cd backend
py -3.12 -m pip install -r requirements.txt
py -3.12 manage.py migrate
py -3.12 manage.py runserver
```

Painel de administração: http://localhost:8000/admin/

Site (noutro terminal):

```
cd frontend-static
py -3.12 -m http.server 3000
```

Abre http://localhost:3000. Em localhost o site fala com o Django local; no site publicado fala com o backend da Vercel (endereço em `frontend-static/assets/js/shared/config.js`).

## Painel de administração

- Local: http://localhost:8000/admin/ (utilizador `tiago`)
- Publicado: o endereço do backend na Vercel seguido de `/admin/`

Palavra-passe perdida: `py -3.12 manage.py changepassword tiago`. Para o site publicado, corre o comando com o `DATABASE_URL` do Neon definido (ver abaixo).

## Atualizar os textos do site publicado

Os textos de base estão em `backend/api/conteudo.py`. O comando `seed_data` aplica-os à base de dados sem apagar projetos ou artigos que tenhas criado no painel. Primeiro vê o que mudaria:

```
$env:DATABASE_URL = "postgres://...do Neon..."     # PowerShell
py -3.12 manage.py migrate
py -3.12 manage.py seed_data --simular
py -3.12 manage.py seed_data
```

Sem `$env:DATABASE_URL`, o comando atua na base local (SQLite).

## Publicar na Vercel

São dois projetos: o backend (Django, função serverless) e o frontend (ficheiros estáticos). Cada `git push` publica o que mudou.

Variáveis do backend na Vercel:

| Variável | Para que serve |
|---|---|
| `DJANGO_SECRET_KEY` | chave secreta do Django (uma chave nova e longa) |
| `DEBUG` | `False` em produção |
| `ALLOWED_HOSTS` | endereço do backend |
| `DATABASE_URL` | ligação ao Neon (PostgreSQL) |
| `CORS_ALLOWED_ORIGINS` | endereço do site (frontend) |
| `CSRF_TRUSTED_ORIGINS` | endereço do site (frontend) |
| `CLOUDINARY_URL` | guarda imagens e ficheiros enviados pelo painel |

A Vercel apaga os ficheiros enviados a cada deploy, por isso as imagens do painel ficam no Cloudinary. Se mudares o CSS do painel, corre `py -3.12 manage.py collectstatic` e envia também a pasta `backend/staticfiles/`.

## Currículo

O currículo em PDF é gerado no navegador a partir dos dados do site (máximo 2 páginas). Para mudar o conteúdo, edita o perfil, a experiência, a formação, as competências e os certificados no painel.

## Contacto no telemóvel

O número de telefone do site abre o cartão de contacto `frontend-static/tiago-banze.vcf`. Para mudar o nome ou os dados que ficam guardados, edita esse ficheiro.
