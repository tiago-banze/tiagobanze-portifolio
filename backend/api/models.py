from django.db import models
from django.utils.text import slugify
from django.utils import timezone
from taggit.managers import TaggableManager


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Service(TimeStampedModel):
    """Catálogo de serviços prestados por Tiago Victor Banze."""

    ICON_CHOICES = [
        ('code', 'Código / Desenvolvimento'),
        ('graduation-cap', 'Académico'),
        ('monitor', 'Treinamento de Software'),
        ('cpu', 'Manutenção de Computadores'),
        ('zap', 'Eletrotécnica'),
        ('smartphone', 'Assistência Mobile'),
    ]

    title = models.CharField('título', max_length=120)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    short_description = models.CharField('descrição curta', max_length=220)
    description = models.TextField('descrição detalhada')
    icon = models.CharField('ícone', max_length=30, choices=ICON_CHOICES, default='code')
    order = models.PositiveIntegerField('ordem', default=0)
    is_active = models.BooleanField('ativo', default=True)

    class Meta:
        ordering = ['order', 'title']
        verbose_name = 'Serviço'
        verbose_name_plural = 'Serviços'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Project(TimeStampedModel):
    """Sistemas e projetos desenvolvidos — puxados manualmente ou via GitHub."""

    STATUS_CHOICES = [
        ('production', 'Em Produção'),
        ('completed', 'Concluído'),
        ('in_progress', 'Em Desenvolvimento'),
        ('archived', 'Arquivado'),
    ]

    title = models.CharField('título', max_length=150)
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    summary = models.CharField('resumo', max_length=250)
    problem = models.TextField('problema técnico', blank=True)
    solution = models.TextField('solução aplicada', blank=True)
    cover_image = models.ImageField('imagem de capa', upload_to='projects/', blank=True, null=True)
    tech_tags = TaggableManager('tecnologias', blank=True, help_text='Ex.: Python, Django, React, IoT, C++')
    repo_url = models.URLField('repositório GitHub', blank=True)
    live_url = models.URLField('demo ao vivo', blank=True)
    status = models.CharField('estado', max_length=20, choices=STATUS_CHOICES, default='completed')
    is_featured = models.BooleanField('destaque', default=False)
    order = models.PositiveIntegerField('ordem', default=0)

    class Meta:
        ordering = ['-is_featured', 'order', '-created_at']
        verbose_name = 'Projeto'
        verbose_name_plural = 'Projetos'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Category(models.Model):
    name = models.CharField('nome', max_length=80, unique=True)
    slug = models.SlugField(max_length=90, unique=True, blank=True)

    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Post(TimeStampedModel):
    """Artigos técnicos do blog — suportam Markdown e SEO/OpenGraph."""

    STATUS_CHOICES = [
        ('draft', 'Rascunho'),
        ('published', 'Publicado'),
    ]

    title = models.CharField('título', max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    excerpt = models.CharField('resumo', max_length=280)
    content = models.TextField('conteúdo (Markdown)')
    cover_image = models.ImageField('imagem de capa', upload_to='blog/', blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    tags = TaggableManager('tags', blank=True)
    status = models.CharField('estado', max_length=10, choices=STATUS_CHOICES, default='published')
    published_at = models.DateTimeField('publicado em', default=timezone.now)
    reading_time_minutes = models.PositiveIntegerField('tempo de leitura (min)', default=5)

    # SEO / Open Graph
    meta_title = models.CharField('meta título', max_length=70, blank=True)
    meta_description = models.CharField('meta descrição', max_length=160, blank=True)

    class Meta:
        ordering = ['-published_at']
        verbose_name = 'Publicação do Blog'
        verbose_name_plural = 'Publicações do Blog'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if not self.meta_title:
            self.meta_title = self.title[:70]
        if not self.meta_description:
            self.meta_description = self.excerpt[:160]
        # estimativa automática de tempo de leitura (~200 palavras/min)
        word_count = len(self.content.split())
        self.reading_time_minutes = max(1, round(word_count / 200))
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Education(TimeStampedModel):
    institution = models.CharField('instituição', max_length=200)
    degree = models.CharField('grau/curso', max_length=200)
    location = models.CharField('local', max_length=120, blank=True)
    start_date = models.DateField('início')
    end_date = models.DateField('fim', null=True, blank=True)
    description = models.TextField('descrição', blank=True)
    order = models.PositiveIntegerField('ordem', default=0)

    class Meta:
        ordering = ['order', '-start_date']
        verbose_name = 'Formação Académica'
        verbose_name_plural = 'Formação Académica'

    def __str__(self):
        return f"{self.degree} — {self.institution}"


class Experience(TimeStampedModel):
    EXPERIENCE_TYPES = [
        ('work', 'Experiência Profissional'),
        ('project', 'Projeto Autónomo'),
        ('certification', 'Certificação'),
    ]

    title = models.CharField('título/cargo', max_length=200)
    organization = models.CharField('organização/cliente', max_length=200, blank=True)
    location = models.CharField('local', max_length=120, blank=True)
    experience_type = models.CharField('tipo', max_length=20, choices=EXPERIENCE_TYPES, default='work')
    start_date = models.DateField('início')
    end_date = models.DateField('fim', null=True, blank=True)
    is_current = models.BooleanField('atual', default=False)
    description = models.TextField('descrição')
    order = models.PositiveIntegerField('ordem', default=0)

    class Meta:
        ordering = ['order', '-start_date']
        verbose_name = 'Experiência'
        verbose_name_plural = 'Linha do Tempo (Experiência)'

    def __str__(self):
        return self.title


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('backend', 'Back-End'),
        ('frontend', 'Front-End'),
        ('embedded', 'Eletrónica / Embarcados'),
        ('network', 'Redes & Infraestrutura'),
        ('tools', 'Ferramentas & Outras'),
    ]
    name = models.CharField('nome', max_length=80)
    category = models.CharField('categoria', max_length=20, choices=CATEGORY_CHOICES)
    proficiency = models.PositiveSmallIntegerField('proficiência (0-100)', default=70)
    order = models.PositiveIntegerField('ordem', default=0)

    class Meta:
        ordering = ['category', 'order']
        verbose_name = 'Competência'
        verbose_name_plural = 'Competências'

    def __str__(self):
        return self.name


class Profile(models.Model):
    """Singleton com os dados centrais exibidos no Hero/Sobre/CV/JSON-LD."""
    full_name = models.CharField(max_length=150, default='Tiago Victor Banze')
    headline = models.CharField(max_length=200, default=(
        'Engenheiro Informático | Desenvolvedor Full-Stack | '
        'Técnico de Redes e Telecomunicações | Técnico Eletricista Residencial'
    ))
    bio_short = models.TextField(default=(
        "Engenheiro Informático formado pela Universidade Metodista Unida de Moçambique, "
        "com raciocínio analítico apurado e paixão por transformar ideias em sistemas funcionais — "
        "do software ao hardware."
    ))
    bio_long = models.TextField(blank=True)
    location = models.CharField(max_length=150, default='Maxixe, Inhambane, Moçambique')
    email = models.EmailField(blank=True, default='tiagovbanze@gmail.com')
    whatsapp_number = models.CharField(max_length=20, default='+258847388489')
    github_url = models.URLField(default='https://github.com/tiago-banze')
    facebook_url = models.URLField(default='https://www.facebook.com/tiago.banze.1')
    cv_file = models.FileField(upload_to='cv/', blank=True, null=True)
    avatar = models.ImageField(upload_to='profile/', blank=True, null=True)
    about_image = models.ImageField(
        'imagem da secção Sobre mim', upload_to='profile/', blank=True, null=True,
        help_text='Imagem opcional mostrada por baixo do texto da secção "Sobre mim".'
    )

    class Meta:
        verbose_name = 'Perfil'
        verbose_name_plural = 'Perfil'

    def __str__(self):
        return self.full_name

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass


class Certification(TimeStampedModel):
    """Certificados e cursos de curta duração — mostrados em slide no site."""

    title = models.CharField('título do curso/certificado', max_length=200)
    issuer = models.CharField('instituição emissora', max_length=200)
    issuer_url = models.URLField('link da instituição (opcional)', blank=True)
    issue_date = models.DateField('data de emissão')
    credential_url = models.URLField('link do certificado/credencial (opcional)', blank=True)
    file = models.FileField(
        'ficheiro do certificado', upload_to='certifications/', blank=True, null=True,
        help_text='Aceita imagem (jpg/png) ou PDF.'
    )
    order = models.PositiveIntegerField('ordem', default=0)

    class Meta:
        ordering = ['order', '-issue_date']
        verbose_name = 'Certificação'
        verbose_name_plural = 'Certificações'

    def __str__(self):
        return f"{self.title} — {self.issuer}"

    @property
    def is_pdf(self):
        return bool(self.file) and str(self.file.name).lower().endswith('.pdf')


class ContactMessage(TimeStampedModel):
    """Mensagens recebidas via formulário de contacto."""
    name = models.CharField('nome', max_length=120)
    email = models.EmailField('email')
    subject = models.CharField('assunto', max_length=200, blank=True)
    message = models.TextField('mensagem')
    is_read = models.BooleanField('lida', default=False)
    ip_address = models.GenericIPAddressField('endereço IP', null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Mensagem de Contacto'
        verbose_name_plural = 'Mensagens de Contacto'

    def __str__(self):
        return f"{self.name} — {self.subject or 'sem assunto'}"


class Comment(TimeStampedModel):
    """
    Comentário de leitor num artigo do blog.
    O e-mail é recolhido apenas para validação/contacto interno e NUNCA é
    devolvido pela API nem exibido publicamente — ver CommentSerializer.
    """
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    name = models.CharField('nome', max_length=100)
    email = models.EmailField('email')
    content = models.TextField('comentário', max_length=1000)
    is_approved = models.BooleanField('aprovado', default=True)
    ip_address = models.GenericIPAddressField('endereço IP', null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Comentário'
        verbose_name_plural = 'Comentários'

    def __str__(self):
        return f"{self.name} em «{self.post.title}»"
