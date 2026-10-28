"""
Aplica os textos de api/conteudo.py à base de dados.

    python manage.py seed_data --simular     mostra o que mudaria, sem gravar nada
    python manage.py seed_data               aplica

- Atualiza o que já existe (procura por slug ou título) e cria o que falta.
- Não apaga projetos, artigos ou competências que tenhas criado no painel.
- Só remove serviços repetidos (o mesmo serviço com dois endereços diferentes).
  Nunca apaga projetos, artigos nem entradas da linha do tempo.
- Não mexe em imagens, nem em ligações (GitHub/demo), nem nas etiquetas dos
  projetos, excepto onde o conteúdo define `tags`.

Usa a base de dados do DATABASE_URL do .env. Para atualizar o site publicado,
aponta o DATABASE_URL para a base do Neon (ver README).
"""
import datetime
from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone
from django.utils.text import slugify

from api import conteudo as c
from api.models import (
    Category, Education, Experience, Post, Profile, Project, Service, Skill,
)


class Command(BaseCommand):
    help = 'Aplica à base de dados os textos em português europeu (api/conteudo.py).'

    def add_arguments(self, parser):
        parser.add_argument('--simular', action='store_true',
                            help='Mostra o que seria feito e desfaz tudo no fim.')

    def handle(self, *args, **opts):
        self.simular = opts['simular']
        with transaction.atomic():
            self.perfil()
            self.servicos()
            self.projetos()
            self.artigos()
            self.percurso()
            self.competencias()
            if self.simular:
                transaction.set_rollback(True)
        if self.simular:
            self.stdout.write(self.style.WARNING('Simulação: nada foi gravado.'))
        else:
            self.stdout.write(self.style.SUCCESS('Conteúdo atualizado.'))

    def log(self, texto):
        self.stdout.write(('[simulação] ' if self.simular else '') + texto)

    # ------------------------------------------------------------------
    def perfil(self):
        profile, criado = Profile.objects.get_or_create(pk=1)
        for campo, valor in c.PERFIL.items():
            setattr(profile, campo, valor)
        if not profile.avatar and not self.simular:
            foto = Path(settings.BASE_DIR) / 'fixtures' / 'avatar' / 'tiago-vitor-banze.jpg'
            if foto.exists():
                with open(foto, 'rb') as f:
                    profile.avatar.save('tiago-vitor-banze.jpg', File(f), save=False)
        profile.save()
        self.log('Perfil: texto atualizado.')

    def servicos(self):
        for s in c.SERVICOS:
            dados = dict(s)
            slugs = dados.pop('slugs')
            existentes = sorted(Service.objects.filter(slug__in=slugs), key=lambda o: slugs.index(o.slug))
            if not existentes:
                Service.objects.create(slug=slugs[0], is_active=True, **dados)
                self.log(f"Serviço criado: {dados['title']}")
                continue
            obj = existentes[0]
            obj.title, obj.short_description, obj.description = dados['title'], dados['short_description'], dados['description']
            obj.save()
            self.log(f"Serviço atualizado: {dados['title']}")
            for repetido in existentes[1:]:
                self.log(f'Serviço repetido removido: {repetido.title}')
                repetido.delete()

    def projetos(self):
        for p in c.PROJETOS:
            dados = dict(p)
            slug = dados.pop('slug')
            tags = dados.pop('tags', None)
            repo_url = dados.pop('repo_url', None)
            obj = Project.objects.filter(slug=slug).first()
            if obj is None:
                obj = Project.objects.create(slug=slug, repo_url=repo_url or '', **dados)
                if tags:
                    obj.tech_tags.set(tags)
                self.log(f"Projeto criado: {dados['title']}")
                continue
            for campo in ('title', 'summary', 'problem', 'solution'):
                setattr(obj, campo, dados[campo])
            # O link da demo estava guardado no campo do repositório. Passa para o sítio certo.
            if 'vercel.app' in obj.repo_url and not obj.live_url:
                obj.live_url, obj.repo_url = obj.repo_url, (repo_url or '')
                self.log(f"Projeto {dados['title']}: link da demo passou para o campo certo.")
            obj.save()
            if tags:
                obj.tech_tags.set(tags)
            self.log(f"Projeto atualizado: {dados['title']}")

    def artigos(self):
        categorias = {}
        for nome in c.CATEGORIAS:
            cat = Category.objects.filter(slug=slugify(nome)).first()
            if cat is None:
                cat = Category.objects.create(name=nome)
            elif cat.name != nome:
                self.log(f'Categoria renomeada: {cat.name} -> {nome}')
                cat.name = nome
                cat.save()
            categorias[nome] = cat
        for i, a in enumerate(c.ARTIGOS):
            obj = Post.objects.filter(slug=a['slug']).first()
            novo = obj is None
            if novo:
                obj = Post(slug=a['slug'], status='published',
                           published_at=timezone.now() - datetime.timedelta(days=i * 6))
            obj.title, obj.excerpt, obj.content = a['title'], a['excerpt'], a['content']
            obj.category = categorias.get(a['category'])
            obj.meta_title = ''          # recalculados no save()
            obj.meta_description = ''
            obj.save()
            obj.tags.set(a['tags'])
            self.log(f"Artigo {'criado' if novo else 'atualizado'}: {a['title']}")

    def percurso(self):
        f = c.FORMACAO
        if not Education.objects.exists():
            Education.objects.create(institution=f['institution'], degree=f['degree'], location='Moçambique',
                                     start_date=datetime.date(2022, 3, 1), end_date=datetime.date(2026, 7, 24),
                                     order=1, description=f['description'])
            self.log('Formação criada.')

        base_nova = not Experience.objects.exists()
        for e in c.EXPERIENCIA:
            obj = Experience.objects.filter(title__in=e['titulos_antigos'] + [e['title']]).first()
            if obj is None:
                if not base_nova:
                    self.log(f"Experiência não encontrada, ignorada: {e['title']}")
                    continue
                inicio, fim = datetime.date(*e['start']), (datetime.date(*e['end']) if e['end'] else None)
                obj = Experience(organization=e['organization'], location=e['location'],
                                 experience_type=e['experience_type'], start_date=inicio,
                                 end_date=fim, is_current=fim is None, order=e['order'])
            obj.title, obj.description = e['title'], e['description']
            obj.save()
            self.log(f"Experiência atualizada: {e['title']}")
        for obj in Experience.objects.filter(title__in=c.EXPERIENCIA_DUPLICADA):
            self.log(f'Atenção: "{obj.title}" parece uma cópia antiga. Não apaguei; vê no painel se queres apagar.')

    def competencias(self):
        if not Skill.objects.exists():
            for i, (nome, categoria, nivel) in enumerate(c.COMPETENCIAS_BASE):
                Skill.objects.create(name=nome, category=categoria, proficiency=nivel, order=i)
        for antigo, novo in c.COMPETENCIAS_RENOMEAR.items():
            n = Skill.objects.filter(name=antigo).update(name=novo)
            if n:
                self.log(f'Competência renomeada: {antigo} -> {novo}')
        self.log('Competências existentes: ' + '; '.join(Skill.objects.values_list('name', flat=True)))
