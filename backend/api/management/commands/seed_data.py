import datetime
from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import (
    Service, Project, Post, Category, Education,
    Experience, Skill, Profile
)


class Command(BaseCommand):
    help = 'Popula a base de dados com informação real do perfil de Tiago Victor Banze.'

    def handle(self, *args, **options):
        self.stdout.write('A popular dados iniciais...')

        # --- Perfil -----------------------------------------------------
        profile, _ = Profile.objects.update_or_create(
            pk=1,
            defaults=dict(
                full_name='Tiago Victor Banze',
                headline=(
                    'Engenheiro Informático | Desenvolvedor Full-Stack | '
                    'Técnico de Redes e Telecomunicações | Técnico Eletricista Residencial'
                ),
                bio_short=(
                    "Engenheiro Informático formado pela Universidade Metodista Unida de Moçambique, "
                    "com forte raciocínio analítico e paixão por transformar ideias em sistemas "
                    "funcionais — do código ao circuito."
                ),
                bio_long=(
                    "Nascido em Maputo, Tiago mudou-se em 2022 para a cidade da Maxixe, província de "
                    "Inhambane, onde reside e atua de forma autónoma como Desenvolvedor Full-Stack, "
                    "Técnico de Redes e Telecomunicações e Técnico Eletricista Residencial. Ao longo da "
                    "sua formação em Engenharia Informática e Tecnologias, desenvolveu um pensamento "
                    "crítico apurado, voltado para a resolução de problemas complexos de forma "
                    "independente — desde a arquitetura de sistemas web até à eletrónica aplicada, "
                    "redes de computadores e fusão de fibra óptica."
                ),
                location='Maxixe, Inhambane, Moçambique',
                email='tiagovbanze@gmail.com',
                whatsapp_number='+258847388489',
                github_url='https://github.com/tiago-banze',
                facebook_url='https://www.facebook.com/tiago.banze.1',
            )
        )

        # Anexa a foto de perfil real (só na primeira vez, para não duplicar ficheiros a cada seed).
        if not profile.avatar:
            avatar_path = settings.BASE_DIR / 'fixtures' / 'avatar' / 'tiago-vitor-banze.jpg'
            if avatar_path.exists():
                with open(avatar_path, 'rb') as f:
                    profile.avatar.save('tiago-vitor-banze.jpg', File(f), save=True)

        # --- Serviços -----------------------------------------------------
        services = [
            dict(title='Desenvolvimento de Software', icon='code', order=1,
                 short_description='Criação de sistemas web, automações e APIs.',
                 description=(
                     'Concepção e desenvolvimento de sistemas web completos, APIs REST e automações '
                     'personalizadas — utilizando tecnologias como Python/Django, React e Next.js, com '
                     'foco em performance, segurança e escalabilidade.'
                 )),
            dict(title='Assessoria e Consultoria Académica', icon='graduation-cap', order=2,
                 short_description='Apoio técnico e orientação para estudantes em projetos tecnológicos.',
                 description=(
                     'Orientação técnica a estudantes universitários no desenvolvimento de projetos de '
                     'graduação e pesquisas tecnológicas — apoiando na definição do problema, arquitetura '
                     'e documentação, sem fazer o projeto pelo aluno, mas orientando-o a chegar lá.'
                 )),
            dict(title='Treinamento em Software de Escritório', icon='monitor', order=3,
                 short_description='Aulas e suporte prático em Word, Excel, PowerPoint.',
                 description=(
                     'Aulas e suporte prático em Pacote Microsoft Office (Word, Excel, PowerPoint) e '
                     'apoio no uso de sistemas académicos e administrativos, adaptado ao ritmo de cada '
                     'cliente.'
                 )),
            dict(title='Manutenção e Reparação de Computadores', icon='cpu', order=4,
                 short_description='Assistência técnica completa a nível de hardware e software.',
                 description=(
                     'Instalação de sistemas operativos e drivers, limpeza física e lógica, diagnóstico '
                     'e reparação de avarias de hardware e software, e manutenção preventiva de '
                     'computadores pessoais e empresariais.'
                 )),
            dict(title='Instalações Elétricas Residenciais', icon='zap', order=5,
                 short_description='Montagem, manutenção e reparação de avarias elétricas residenciais.',
                 description=(
                     'Montagem, manutenção e reparação de avarias elétricas residenciais — projeto e '
                     'instalação focados no âmbito doméstico, não eletrotécnica industrial.'
                 )),
            dict(title='Assistência Técnica Mobile', icon='smartphone', order=6,
                 short_description='Suporte técnico focado exclusivamente em software para smartphones.',
                 description=(
                     'Suporte técnico exclusivamente a nível de software para smartphones: desbloqueio, '
                     'configuração de sistemas, resolução de falhas de software e restauro de fábrica.'
                 )),
        ]
        for s in services:
            Service.objects.update_or_create(title=s['title'], defaults=s)

        # --- Categorias do blog -------------------------------------------
        categories = ['Engenharia de Software', 'Redes de Computadores', 'Eletrónica & IoT']
        cat_objs = {}
        for c in categories:
            obj, _ = Category.objects.get_or_create(name=c)
            cat_objs[c] = obj

        # --- Projetos -------------------------------------------------
        projects = [
            dict(
                title='GateFlow',
                summary='Sistema completo de check-in e gestão de acesso para eventos.',
                problem='Organizadores de eventos em Moçambique dependiam de listas em papel para o controlo de entrada, gerando filas longas e fraudes de bilhetes.',
                solution='Sistema web com geração de bilhetes com QR Code, validação em tempo real e painel administrativo, construído em Flask/Jinja2 com base de dados PostgreSQL (Neon) e deploy na Vercel.',
                tags=['Python', 'Flask', 'PostgreSQL', 'Jinja2'],
                status='production', is_featured=True, order=1,
                repo_url='https://github.com/tiago-banze',
            ),
            dict(
                title='Portfólio Pessoal Dinâmico',
                summary='Esta plataforma web interativa, com Blog técnico e CV integrado.',
                problem='Necessidade de uma presença profissional online, indexável pelo Google, com blog técnico e painel de administração de conteúdo próprio.',
                solution='Front-end em Next.js (SSR/SSG) para SEO máximo, back-end em Django REST Framework com painel administrativo para gerir projetos, blog e serviços.',
                tags=['Next.js', 'TypeScript', 'Django', 'DRF', 'Tailwind CSS'],
                status='completed', is_featured=True, order=2,
                repo_url='https://github.com/tiago-banze',
            ),
            dict(
                title='Plataforma de E-Commerce & Delivery Interativo',
                summary='O cliente pede um produto de qualquer loja local, e um estafeta compra e entrega em casa.',
                problem='Compradores sem tempo ou meio de transporte não conseguem obter produtos de lojas locais que não fazem entregas próprias.',
                solution='Plataforma onde o cliente descreve o produto e a loja pretendida (ex: uma botija de gás); um estafeta aceita o pedido, realiza a compra física e entrega na residência, com pagamento no ato da entrega. Em desenvolvimento.',
                tags=['Next.js', 'Django', 'PostgreSQL', 'Logística'],
                status='in_progress', is_featured=False, order=3,
            ),
            dict(
                title='Sistema de Gestão de Tarefas e Agendas',
                summary='Plataforma para organização pessoal, agendamento e gestão de rotinas.',
                problem='Falta de uma ferramenta simples e local para organizar tarefas, compromissos e rotinas diárias.',
                solution='Sistema web para criação de tarefas, agendamento de compromissos e acompanhamento de rotinas, com lembretes e categorização. Em desenvolvimento.',
                tags=['Next.js', 'Django', 'TypeScript'],
                status='in_progress', is_featured=False, order=4,
            ),
        ]
        Project.objects.all().delete()
        for p in projects:
            tags = p.pop('tags')
            obj = Project.objects.create(**p)
            obj.tech_tags.set(tags)

        # --- Posts do blog (tutoriais técnicos completos) -------------------------------------------------
        posts = [
            dict(
                title='Como Configurar um Servidor Django do Zero para Produção',
                excerpt='Guia completo: WSGI/ASGI, Gunicorn, Nginx, variáveis de ambiente e checklist de segurança.',
                content=DJANGO_PRODUCTION_POST,
                category=cat_objs['Engenharia de Software'],
                tags=['Django', 'DevOps', 'Gunicorn', 'Nginx', 'Segurança'],
            ),
            dict(
                title='Guia Prático de Fusão de Fibra Óptica',
                excerpt='Preparação do cabo, clivagem, fusão por arco elétrico, atenuação e testes com OTDR.',
                content=FIBER_FUSION_POST,
                category=cat_objs['Redes de Computadores'],
                tags=['Redes', 'Fibra Óptica', 'OTDR', 'Infraestrutura'],
            ),
            dict(
                title='Introdução Prática a Sistemas Embarcados',
                excerpt='Arquitetura de microcontroladores, portas GPIO, protocolos I2C/SPI/UART e um primeiro projeto em C.',
                content=EMBEDDED_SYSTEMS_POST,
                category=cat_objs['Eletrónica & IoT'],
                tags=['Embarcados', 'C/C++', 'GPIO', 'Microcontroladores'],
            ),
        ]
        Post.objects.all().delete()
        for i, p in enumerate(posts):
            tags = p.pop('tags')
            p['published_at'] = timezone.now() - datetime.timedelta(days=i * 6)
            obj = Post.objects.create(**p)
            obj.tags.set(tags)

        # --- Formação Académica -------------------------------------------------
        Education.objects.update_or_create(
            institution='Universidade Metodista Unida de Moçambique',
            degree='Licenciatura em Engenharia Informática e Tecnologias',
            defaults=dict(
                location='Moçambique',
                start_date=datetime.date(2022, 3, 1),
                end_date=datetime.date(2026, 7, 24),
                description=(
                    'Formação em Engenharia Informática e Tecnologias, com defesa do trabalho de '
                    'conclusão de curso em julho de 2026.'
                ),
                order=1,
            )
        )

        # --- Experiência / Linha do tempo -------------------------------------------------
        experiences = [
            dict(
                title='Desenvolvedor Full-Stack Autónomo',
                organization='Projetos independentes',
                location='Maxixe, Inhambane',
                experience_type='project',
                start_date=datetime.date(2023, 1, 1),
                is_current=True,
                description=(
                    'Conceção, arquitetura e execução independente de sistemas web, incluindo o GateFlow '
                    '(check-in de eventos) e a plataforma de E-Commerce & Delivery, atualmente em '
                    'desenvolvimento.'
                ),
                order=1,
            ),
            dict(
                title='Técnico de Redes, Eletricista e Prestador de Serviços Técnicos',
                organization='Autónomo',
                location='Maxixe, Inhambane',
                experience_type='work',
                start_date=datetime.date(2022, 6, 1),
                is_current=True,
                description=(
                    'Prestação de serviços de manutenção de computadores, redes de computadores e fusão '
                    'de fibra óptica, instalações elétricas residenciais, assistência técnica mobile e '
                    'treinamento em software de escritório.'
                ),
                order=2,
            ),
            dict(
                title='Defesa do Trabalho de Conclusão de Curso',
                organization='Universidade Metodista Unida de Moçambique',
                location='Moçambique',
                experience_type='certification',
                start_date=datetime.date(2026, 7, 24),
                end_date=datetime.date(2026, 7, 24),
                is_current=False,
                description='Defesa pública do trabalho de final de curso em Engenharia Informática e Tecnologias.',
                order=3,
            ),
        ]
        for e in experiences:
            Experience.objects.update_or_create(title=e['title'], organization=e['organization'], defaults=e)

        # --- Competências (nível real de domínio) -------------------------------------------------
        Skill.objects.all().delete()
        skills = [
            # Domínio forte / avançado
            ('SQLite', 'backend', 90),
            ('C/C++ (Embarcados)', 'embedded', 92),
            ('Microcontroladores (Arduino, Raspberry Pi)', 'embedded', 90),
            ('Eletrónica Aplicada', 'embedded', 88),
            ('Hardware & Diagnóstico de Computadores', 'tools', 90),
            ('Redes de Computadores', 'network', 92),
            ('Fusão de Fibra Óptica', 'network', 88),
            ('Git & GitHub', 'tools', 88),
            ('Linux', 'tools', 85),
            ('Windows', 'tools', 85),
            # Domínio intermediário / em evolução
            ('Python (Django / DRF)', 'backend', 65),
            ('PostgreSQL', 'backend', 60),
            ('MySQL', 'backend', 60),
            ('React', 'frontend', 60),
            # Conhecimento básico / nível de entrada
            ('Next.js', 'frontend', 40),
            ('Tailwind CSS', 'frontend', 40),
            ('TypeScript', 'frontend', 35),
        ]
        for i, (name, category, prof) in enumerate(skills):
            Skill.objects.update_or_create(name=name, defaults=dict(category=category, proficiency=prof, order=i))

        self.stdout.write(self.style.SUCCESS('Dados iniciais criados/atualizados com sucesso!'))


DJANGO_PRODUCTION_POST = r"""
## Introdução

Colocar um projeto Django em produção envolve muito mais do que `runserver`. Este guia cobre o caminho completo: WSGI/ASGI, Gunicorn, Nginx como proxy reverso, variáveis de ambiente e um checklist de segurança.

## 1. WSGI vs ASGI — qual usar?

- **WSGI** (`core/wsgi.py`) é o padrão para aplicações Django tradicionais, síncronas. É o que o Gunicorn usa por omissão.
- **ASGI** (`core/asgi.py`) é necessário se usar WebSockets, Django Channels ou código assíncrono (`async def` em views).

Se o seu projeto só tem views REST normais, fique com WSGI — é mais simples e mais testado em produção.

## 2. Variáveis de ambiente

Nunca deixe segredos no código. Use `python-decouple` ou `django-environ`:

```python
# settings.py
from decouple import config

SECRET_KEY = config('DJANGO_SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=lambda v: [s.strip() for s in v.split(',')])
```

E no servidor, um ficheiro `.env` (nunca no Git):

```
DJANGO_SECRET_KEY=uma-chave-longa-e-aleatoria
DEBUG=False
ALLOWED_HOSTS=meudominio.co.mz,www.meudominio.co.mz
```

Gere uma `SECRET_KEY` segura com:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## 3. Gunicorn — o servidor de aplicação

Instale e teste localmente:

```bash
pip install gunicorn
gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3
```

Regra prática para o número de *workers*: `(2 × núcleos de CPU) + 1`.

Para produção, crie um serviço `systemd` (`/etc/systemd/system/gunicorn.service`):

```ini
[Unit]
Description=Gunicorn - Django
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/meuprojeto/backend
ExecStart=/var/www/meuprojeto/backend/venv/bin/gunicorn \
          --workers 3 \
          --bind unix:/run/gunicorn.sock \
          core.wsgi:application

[Install]
WantedBy=multi-user.target
```

Ative com:

```bash
sudo systemctl enable --now gunicorn
```

## 4. Nginx como proxy reverso

```nginx
server {
    listen 80;
    server_name meudominio.co.mz;

    location /static/ {
        alias /var/www/meuprojeto/backend/staticfiles/;
    }

    location /media/ {
        alias /var/www/meuprojeto/backend/media/;
    }

    location / {
        proxy_pass http://unix:/run/gunicorn.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Depois disso, use `certbot` para HTTPS gratuito (Let's Encrypt):

```bash
sudo certbot --nginx -d meudominio.co.mz
```

## 5. Checklist de segurança antes de ir ao ar

```python
DEBUG = False
ALLOWED_HOSTS = ['meudominio.co.mz']
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
X_FRAME_OPTIONS = 'DENY'
```

Corra também `python manage.py check --deploy` — o próprio Django avisa sobre configurações inseguras.

## 6. Ficheiros estáticos

```bash
python manage.py collectstatic --noinput
```

Com o `whitenoise` configurado no `MIDDLEWARE`, o Gunicorn já consegue servir estáticos comprimidos sem depender do Nginx para isso, o que simplifica bastante o deploy inicial.

## Conclusão

Com Gunicorn + Nginx + variáveis de ambiente + o checklist de segurança do Django, tem uma base de produção robusta, replicável em qualquer VPS Linux.
""".strip()


FIBER_FUSION_POST = r"""
## Introdução

A fusão de fibra óptica é o processo de unir duas fibras através de calor controlado (arco elétrico), garantindo baixíssima perda de sinal na emenda. Este guia cobre o processo de campo, do início ao teste final.

## 1. Equipamento necessário

- Fusionadora de fibra óptica (com alinhamento por núcleo, idealmente)
- Decapador de fibra (para remover a capa e o revestimento)
- Clivador de precisão
- Álcool isopropílico + toalhetes sem fiapos
- Mangas de proteção térmica (splice protection sleeves)
- Bandeja/organizador de fusões
- OTDR (Optical Time-Domain Reflectometer) para testes

## 2. Preparação do cabo

1. Remova a capa externa do cabo com cuidado, sem tocar nas fibras internas.
2. Identifique e separe as fibras pela cor (padrão de cores TIA/EIA-598).
3. Remova o revestimento (coating) de cada fibra com o decapador, deixando cerca de 30-40 mm de fibra nua.
4. Limpe a fibra nua com álcool isopropílico e um toalhete sem fiapos — qualquer resíduo de gordura ou pó aumenta a perda na fusão.

## 3. Clivagem (cleaving)

A clivagem cria uma face perfeitamente plana e perpendicular na ponta da fibra — é o passo mais crítico:

- Ajuste o clivador para o comprimento correto (normalmente 8-16 mm, conforme o modelo da fusionadora).
- Um corte de má qualidade (ângulo inclinado, lascas) é a causa mais comum de fusões com alta perda.
- Inspecione visualmente ou no microscópio da fusionadora antes de prosseguir.

## 4. Fusão por arco elétrico

1. Insira as duas pontas clivadas na fusionadora, uma de cada lado.
2. A máquina alinha automaticamente os núcleos (ou revestimentos, em modelos mais simples).
3. O arco elétrico funde as duas pontas, criando uma junção contínua.
4. A fusionadora estima a perda da emenda (normalmente entre 0.01 e 0.05 dB numa fusão bem executada).

## 5. Proteção da emenda

Depois da fusão, desliza-se uma manga de proteção térmica sobre a junção e aquece-se num forno próprio da fusionadora (normalmente 30-90 segundos), que a retrai e protege mecanicamente a fibra fundida.

## 6. Testes com OTDR

O OTDR envia um pulso de luz pela fibra e mede a luz refletida, permitindo:

- Localizar a distância exata de cada emenda e eventuais falhas
- Medir a atenuação (perda de sinal) em cada ponto do trajeto
- Confirmar que a perda total está dentro do orçamento óptico do projeto (tipicamente < 0.3 dB por emenda de fusão)

## 7. Boas práticas de campo

- Nunca olhe diretamente para a ponta de uma fibra ativa — o laser é invisível e pode causar danos oculares.
- Mantenha a área de trabalho limpa; poeira é o maior inimigo da fusão de fibra.
- Registe a atenuação de cada emenda num relatório — facilita diagnósticos futuros.
- Proteja sempre as fusões dentro de uma caixa de emenda (splice closure) apropriada para ambiente externo ou interno.

## Conclusão

Fusão de fibra óptica é uma competência que se aperfeiçoa com repetição — clivagem limpa e ambiente livre de poeira resolvem a grande maioria dos problemas de alta atenuação em campo.
""".strip()


EMBEDDED_SYSTEMS_POST = r"""
## Introdução

Sistemas embarcados combinam hardware e software dedicados a uma função específica. Este guia cobre a arquitetura básica de um microcontrolador, os protocolos de comunicação mais usados e um primeiro projeto em C.

## 1. Arquitetura de um microcontrolador

Um microcontrolador (MCU) integra, num único chip:

- **CPU** — o núcleo de processamento (ex: ARM Cortex-M, AVR, Xtensa no ESP32)
- **Memória Flash** — onde o programa fica gravado permanentemente
- **RAM** — memória volátil para variáveis em tempo de execução
- **Periféricos** — temporizadores, conversores ADC/DAC, portas de comunicação
- **Pinos GPIO** — General Purpose Input/Output, controláveis por software

## 2. Portas GPIO

Cada pino GPIO pode ser configurado como entrada (ler um sinal, ex: um botão) ou saída (controlar algo, ex: acender um LED). Em baixo nível, isto é feito escrevendo diretamente em registradores do microcontrolador.

Exemplo conceptual em pseudo-registrador (estilo AVR/Arduino):

```c
// Configura o pino 13 como saída
DDRB |= (1 << PB5);

// Liga o pino 13 (nível alto)
PORTB |= (1 << PB5);

// Desliga o pino 13 (nível baixo)
PORTB &= ~(1 << PB5);
```

## 3. Protocolos de comunicação: I2C, SPI e UART

| Protocolo | Fios | Velocidade | Uso típico |
|---|---|---|---|
| **UART** | 2 (TX, RX) | Baixa-média | Comunicação ponto-a-ponto simples (ex: módulo GPS, debug via serial) |
| **I2C** | 2 (SDA, SCL) | Média | Vários sensores no mesmo barramento, com endereços diferentes |
| **SPI** | 4 (MOSI, MISO, SCK, CS) | Alta | Displays, cartões SD, sensores que exigem alta taxa de transferência |

- **UART** é assíncrono — não há linha de relógio partilhada, ambos os lados combinam a mesma *baud rate* previamente.
- **I2C** usa endereços de 7 bits, permitindo múltiplos dispositivos no mesmo par de fios.
- **SPI** é o mais rápido, mas exige um pino de *Chip Select* (CS) dedicado por dispositivo.

## 4. Primeiro projeto: LED intermitente (blink) em C puro, para AVR

```c
#include <avr/io.h>
#include <util/delay.h>

#define LED_PIN PB5

int main(void) {
    // Configura o pino do LED como saída
    DDRB |= (1 << LED_PIN);

    while (1) {
        PORTB ^= (1 << LED_PIN); // Inverte o estado do pino (toggle)
        _delay_ms(500);           // Espera 500 ms
    }

    return 0;
}
```

Compilação e gravação (exemplo com `avr-gcc` e um Arduino Uno como programador):

```bash
avr-gcc -mmcu=atmega328p -Os -o blink.elf blink.c
avr-objcopy -O ihex blink.elf blink.hex
avrdude -c arduino -p atmega328p -P /dev/ttyUSB0 -b 115200 -U flash:w:blink.hex
```

## 5. O mesmo projeto em Arduino (C++ simplificado)

```cpp
#define LED_PIN 13

void setup() {
    pinMode(LED_PIN, OUTPUT);
}

void loop() {
    digitalWrite(LED_PIN, HIGH);
    delay(500);
    digitalWrite(LED_PIN, LOW);
    delay(500);
}
```

O `Arduino IDE` abstrai o acesso direto aos registradores (`DDRB`, `PORTB`) através de funções como `pinMode()` e `digitalWrite()` — internamente, fazem exatamente a mesma manipulação de registradores mostrada na secção 2.

## Conclusão

Entender o que acontece "por baixo do capô" das funções do Arduino — manipulação direta de registradores — é o que separa quem só copia exemplos de quem consegue depurar e otimizar sistemas embarcados de verdade.
""".strip()
