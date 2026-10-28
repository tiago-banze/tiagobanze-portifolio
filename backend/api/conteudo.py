"""
Textos do portefólio, em português europeu.

É aqui que ficam os textos "de base". O comando `python manage.py seed_data`
aplica-os à base de dados: atualiza o que já existe (procura por slug ou por
título) e cria o que falta. Não apaga projetos, artigos nem nada que tenhas
acrescentado no painel de administração.

Se mudares um texto no painel e correres o comando outra vez, o texto volta ao
que está neste ficheiro. Por isso, depois de acertares os textos, só voltas a
correr o comando se quiseres mesmo repor estes.
"""

PERFIL = dict(
    headline=(
        'Engenheiro Informático | Programador Full-Stack | '
        'Técnico de Redes e Telecomunicações | Eletricista Residencial'
    ),
    bio_short=(
        'Engenheiro informático pela Universidade Metodista Unida de Moçambique. '
        'Faço sistemas web e trabalho também com redes, eletricidade e eletrónica, '
        'na Maxixe.'
    ),
    bio_long=(
        'Nasci em Maputo e desde 2022 vivo na Maxixe, em Inhambane. '
        'Trabalho por conta própria: desenvolvo sistemas web, arranjo computadores, '
        'faço instalações elétricas em casas e dou formação em Word, Excel e PowerPoint.\n\n'
        'Estudei Engenharia Informática e Tecnologias na Universidade Metodista Unida '
        'de Moçambique e defendi a monografia em julho de 2026. Fora do software, '
        'interesso-me por eletrónica, redes e microcontroladores, e tenho cursos de '
        'eletricidade e de sistemas solares fotovoltaicos.'
    ),
)

# `slugs`: endereços que o serviço pode ter na base de dados (o primeiro é o novo).
# Se existirem vários para o mesmo serviço, fica o primeiro e os outros são removidos.
# O ícone e a ordem só são usados quando o serviço é criado de novo.
SERVICOS = [
    dict(
        slugs=['desenvolvimento-de-software-e-web', 'desenvolvimento-de-software'], icon='code', order=1,
        title='Desenvolvimento de software e web',
        short_description='Sites, sistemas web, APIs e automatismos à medida.',
        description=(
            'Sites, sistemas web, APIs REST e automatismos feitos à medida. '
            'Trabalho sobretudo com Python e Django, e também com React.'
        ),
    ),
    dict(
        slugs=['projetos-academicos-consultoria', 'assessoria-e-consultoria-academica'], icon='graduation-cap', order=2,
        title='Projetos académicos e consultoria',
        short_description='Apoio técnico a estudantes em monografias e trabalhos de investigação.',
        description=(
            'Apoio a estudantes universitários nos projetos finais de curso e nos trabalhos '
            'de investigação tecnológica: da definição do problema à documentação e à '
            'preparação da defesa.'
        ),
    ),
    dict(
        slugs=['assistencia-e-treinamento-de-software', 'treinamento-em-software-de-escritorio'], icon='monitor', order=3,
        title='Formação em software',
        short_description='Aulas práticas de Word, Excel, PowerPoint e sistemas académicos.',
        description=(
            'Aulas individuais de Microsoft Office (Word, Excel e PowerPoint) e de sistemas '
            'académicos e administrativos, ao ritmo de cada pessoa.'
        ),
    ),
    dict(
        slugs=['manutencao-e-reparacao-de-computadores'], icon='cpu', order=4,
        title='Manutenção e reparação de computadores',
        short_description='Hardware e software, em computadores pessoais e de empresas.',
        description=(
            'Instalação de sistemas operativos e drivers, limpeza física e do sistema, '
            'diagnóstico e reparação de avarias, e manutenção preventiva.'
        ),
    ),
    dict(
        slugs=['instalacoes-eletrotecnicas-residenciais', 'instalacoes-eletricas-residenciais'], icon='zap', order=5,
        title='Instalações elétricas residenciais',
        short_description='Montagem, manutenção e reparação de instalações elétricas em casas.',
        description=(
            'Projeto e montagem de instalações elétricas em casas, manutenção preventiva e '
            'reparação de avarias. Trabalho apenas em instalações residenciais.'
        ),
    ),
    dict(
        slugs=['assistencia-tecnica-mobile'], icon='smartphone', order=6,
        title='Assistência a telemóveis',
        short_description='Só software: desbloqueio, configuração e restauro.',
        description=(
            'Assistência apenas ao nível do software em smartphones: desbloqueio, '
            'configuração do sistema, resolução de falhas e restauro de fábrica.'
        ),
    ),
]

# slug -> texto. `tags` só é aplicado quando o campo existe aqui.
PROJETOS = [
    dict(
        slug='gateflow', title='GateFlow', status='production', is_featured=True, order=1,
        summary='Controlo de entradas em eventos com bilhetes de QR Code.',
        problem=(
            'Em muitos eventos em Moçambique a entrada é controlada com listas em papel. '
            'Isso cria filas e deixa passar bilhetes falsificados.'
        ),
        solution=(
            'Aplicação web em Flask. Cada bilhete leva um QR Code, que é validado à entrada '
            'em tempo real, e a organização tem um painel para acompanhar tudo. '
            'Usa PostgreSQL (Neon) e está publicada na Vercel.'
        ),
        tags=['Python', 'Flask', 'PostgreSQL', 'Jinja2'],
        repo_url='https://github.com/tiago-banze',
    ),
    dict(
        slug='portfolio-pessoal-dinamico', title='Este portefólio', status='completed',
        is_featured=True, order=2,
        summary='O site que estás a ver: portefólio, blog e currículo, com painel de administração.',
        problem=(
            'Queria uma presença própria na internet, com blog e currículo, e poder '
            'atualizar tudo sozinho, sem mexer no código.'
        ),
        solution=(
            'O conteúdo é gerido num painel de administração em Django. Daí sai para '
            'ficheiros simples, e o site em HTML, CSS e JavaScript é publicado na Vercel.'
        ),
        tags=['Django', 'DRF', 'HTML5', 'CSS', 'JavaScript'],
        repo_url='https://github.com/tiago-banze',
    ),
    dict(
        slug='plataforma-de-e-commerce-delivery-interativo',
        title='Plataforma de compras e entregas', status='in_progress', is_featured=False, order=3,
        summary='O cliente pede um produto de uma loja local e um estafeta compra e entrega em casa.',
        problem=(
            'Quem não tem tempo nem transporte não consegue comprar em lojas locais '
            'que não fazem entregas.'
        ),
        solution=(
            'O cliente descreve o produto e a loja (por exemplo, uma botija de gás). '
            'Um estafeta aceita o pedido, compra na loja e entrega em casa. '
            'O pagamento é feito no ato da entrega. Ainda em desenvolvimento.'
        ),
    ),
]

CATEGORIAS = ['Engenharia de Software', 'Redes de Computadores', 'Eletrónica & IoT']

ARTIGO_DJANGO = r"""
Pôr um projeto Django em produção dá mais trabalho do que `runserver`. Estas são as peças necessárias e a ordem em que costumam ser configuradas.

## WSGI ou ASGI

Se o projeto só tem views normais e uma API REST, fica com WSGI (`core/wsgi.py`). É o que o Gunicorn usa por omissão e é o caminho mais simples. O ASGI só compensa quando há WebSockets, Django Channels ou views assíncronas.

## Segredos fora do código

A chave secreta e a configuração do servidor vão para variáveis de ambiente. Com `python-decouple`:

```python
# settings.py
from decouple import config

SECRET_KEY = config('DJANGO_SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=lambda v: [s.strip() for s in v.split(',')])
```

No servidor, um ficheiro `.env` que nunca entra no Git:

```
DJANGO_SECRET_KEY=uma-chave-longa-e-aleatoria
DEBUG=False
ALLOWED_HOSTS=meudominio.co.mz,www.meudominio.co.mz
```

Para gerar uma chave nova:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## Gunicorn

Testa primeiro à mão:

```bash
pip install gunicorn
gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3
```

Como ponto de partida, o número de workers é `(2 × núcleos) + 1`. Para ficar sempre a correr, cria um serviço systemd em `/etc/systemd/system/gunicorn.service`:

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

```bash
sudo systemctl enable --now gunicorn
```

## Nginx à frente

O Nginx recebe os pedidos e passa-os ao Gunicorn pelo socket:

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

O HTTPS grátis vem do Let's Encrypt:

```bash
sudo certbot --nginx -d meudominio.co.mz
```

## Antes de ir para o ar

```python
DEBUG = False
ALLOWED_HOSTS = ['meudominio.co.mz']
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
X_FRAME_OPTIONS = 'DENY'
```

Corre também `python manage.py check --deploy`. O próprio Django avisa do que ficou mal configurado.

## Ficheiros estáticos

```bash
python manage.py collectstatic --noinput
```

Com o `whitenoise` no `MIDDLEWARE`, o Django serve os estáticos comprimidos sozinho, o que poupa trabalho na primeira instalação.
""".strip()

ARTIGO_FIBRA = r"""
Fundir fibra ótica é unir duas fibras com um arco elétrico, de forma a que a luz passe de uma para a outra com a menor perda possível. Estes são os passos de uma emenda, do cabo ao teste.

## O que é preciso

- fusionadora (de preferência com alinhamento pelo núcleo)
- decapador de fibra e clivador de precisão
- álcool isopropílico e toalhetes sem pelos
- mangas de proteção térmica
- bandeja ou caixa de emendas
- OTDR para testar no fim

## Preparar o cabo

1. Tira a capa exterior sem tocar nas fibras que estão dentro.
2. Separa as fibras pela cor, seguindo o código TIA/EIA-598.
3. Tira o revestimento de cada fibra com o decapador, deixando 30 a 40 mm de fibra nua.
4. Limpa a fibra nua com álcool e um toalhete sem pelos. Um grão de pó ou um resto de gordura chega para estragar a emenda.

Não te esqueças de passar a manga de proteção por uma das fibras **antes** de fundir. Depois da emenda já não dá.

## Clivar

A clivagem deixa a ponta da fibra plana e a direito. É o passo que mais pesa no resultado: um corte inclinado ou com lascas é a causa mais comum de emendas com perda alta. Regula o clivador para o comprimento que a tua fusionadora pede (normalmente entre 8 e 16 mm) e vê a ponta no ecrã da máquina antes de continuar. Se estiver mal, volta a cortar.

## Fundir

Põe as duas pontas na fusionadora, uma de cada lado. A máquina alinha-as, dá o arco e mostra uma estimativa da perda. Numa emenda bem feita fica normalmente abaixo de 0,05 dB.

## Proteger a emenda

Corre a manga sobre a junção e leva-a ao forno da fusionadora (30 a 90 segundos, conforme o modelo). A manga encolhe e protege a fibra, que nesse ponto está frágil. Depois arruma a emenda na bandeja.

## Medir com o OTDR

O OTDR manda um pulso de luz pela fibra e mede o que volta. Com ele vês a que distância está cada emenda, quanto se perde em cada uma e se o total cabe no orçamento ótico do projeto. Como referência, uma emenda por fusão deve ficar abaixo de 0,1 dB, e muitos projetos aceitam até 0,3 dB.

## Cuidados no terreno

- Nunca olhes para a ponta de uma fibra que possa estar acesa. A luz é infravermelha, não a vês, e faz mal aos olhos.
- Trabalha num sítio limpo. O pó é o maior inimigo de uma boa emenda.
- Guarda a perda de cada emenda num registo. Ajuda muito quando aparece uma avaria meses depois.
- Fecha as emendas numa caixa própria para o local onde ficam, interior ou exterior.
""".strip()

ARTIGO_EMBEBIDOS = r"""
Um sistema embebido é um computador pequeno feito para uma única tarefa, como ler um sensor ou acender um LED. Aqui fica o essencial para começar: o que tem um microcontrolador por dentro, como se falam os componentes e um primeiro programa.

## O que tem um microcontrolador

Num só chip ficam:

- a **CPU**, que executa o programa (ARM Cortex-M, AVR, ou Xtensa no ESP32, por exemplo)
- a memória **Flash**, onde o programa fica gravado
- a **RAM**, para as variáveis enquanto o programa corre
- os periféricos: temporizadores, conversores analógico-digitais, portas de comunicação
- os pinos **GPIO**, que o programa liga e desliga ou lê

## Pinos GPIO

Cada pino pode ser entrada (ler um botão) ou saída (acender um LED). Por baixo, isso é escrever em registos do microcontrolador. Num AVR, como o do Arduino Uno, o pino 13 é o bit 5 do porto B:

```c
DDRB  |=  (1 << PB5);   // pino como saída
PORTB |=  (1 << PB5);   // nível alto, LED aceso
PORTB &= ~(1 << PB5);   // nível baixo, LED apagado
```

## UART, I2C e SPI

| Protocolo | Fios | Velocidade | Quando usar |
|---|---|---|---|
| UART | 2 (TX, RX) | baixa a média | ligação direta entre dois dispositivos, como um módulo GPS ou a consola série |
| I2C | 2 (SDA, SCL) | média | vários sensores no mesmo par de fios, cada um com o seu endereço |
| SPI | 4 (MOSI, MISO, SCK, CS) | alta | ecrãs, cartões SD e sensores que precisam de muita velocidade |

No UART não há relógio partilhado, por isso os dois lados têm de combinar a mesma velocidade (baud rate). O I2C usa endereços de 7 bits. O SPI é o mais rápido, mas pede um pino CS para cada dispositivo.

## Primeiro programa: LED a piscar em C

```c
#include <avr/io.h>
#include <util/delay.h>

#define LED_PIN PB5

int main(void) {
    DDRB |= (1 << LED_PIN);       // pino do LED como saída

    while (1) {
        PORTB ^= (1 << LED_PIN);  // inverte o estado
        _delay_ms(500);
    }
}
```

Para compilar e gravar num Arduino Uno com `avr-gcc` e `avrdude`:

```bash
avr-gcc -mmcu=atmega328p -Os -o blink.elf blink.c
avr-objcopy -O ihex blink.elf blink.hex
avrdude -c arduino -p atmega328p -P /dev/ttyUSB0 -b 115200 -U flash:w:blink.hex
```

## O mesmo no Arduino

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

`pinMode()` e `digitalWrite()` fazem, por dentro, o mesmo que o exemplo em C: mexem nos registos `DDRB` e `PORTB`. Perceber isso ajuda muito quando é preciso encontrar um erro ou tornar o código mais rápido.
""".strip()

ARTIGOS = [
    dict(
        slug='como-configurar-um-servidor-django-do-zero-para-producao',
        title='Django em produção: Gunicorn, Nginx e o que verificar antes de publicar',
        excerpt='Variáveis de ambiente, Gunicorn como serviço, Nginx à frente, HTTPS e as definições de segurança que o Django pede.',
        category='Engenharia de Software',
        tags=['Django', 'DevOps', 'Gunicorn', 'Nginx', 'Segurança'],
        content=ARTIGO_DJANGO,
    ),
    dict(
        slug='guia-pratico-de-fusao-de-fibra-optica',
        title='Como fazer uma emenda de fibra ótica por fusão',
        excerpt='Da preparação do cabo à medição com OTDR: clivagem, fusão, proteção da emenda e cuidados no terreno.',
        category='Redes de Computadores',
        tags=['Redes', 'Fibra ótica', 'OTDR', 'Infraestrutura'],
        content=ARTIGO_FIBRA,
    ),
    dict(
        slug='introducao-pratica-a-sistemas-embarcados',
        title='Sistemas embebidos: do pino GPIO ao LED a piscar',
        excerpt='O que tem um microcontrolador por dentro, como funcionam UART, I2C e SPI, e um primeiro programa em C.',
        category='Eletrónica & IoT',
        tags=['Sistemas embebidos', 'C/C++', 'GPIO', 'Microcontroladores'],
        content=ARTIGO_EMBEBIDOS,
    ),
]

FORMACAO = dict(
    institution='Universidade Metodista Unida de Moçambique',
    degree='Licenciatura em Engenharia Informática e Tecnologias',
    description='Monografia defendida a 24 de julho de 2026, com nota 14.',
)

# Procuradas pelo título atual. `title_antigo` serve para encontrar a entrada que já existe.
EXPERIENCIA = [
    dict(
        titulos_antigos=['Desenvolvedor Full-Stack Autónomo', 'Desenvolvedor Full-Stack Autnomo'],
        title='Programador Full-Stack Autónomo',
        organization='Projetos independentes', location='Maxixe, Inhambane',
        experience_type='project', start=(2023, 1, 1), end=None, order=1,
        description=(
            'Desenho e desenvolvimento de sistemas web por conta própria. Entre eles, o GateFlow, '
            'para controlo de entradas em eventos, e uma plataforma de compras e entregas que '
            'ainda está em desenvolvimento.'
        ),
    ),
    dict(
        titulos_antigos=['Prestador de Serviços Técnicos'],
        title='Prestador de Serviços Técnicos',
        organization='Autónomo', location='Maxixe, Inhambane',
        experience_type='work', start=(2022, 6, 1), end=None, order=2,
        description=(
            'Manutenção de computadores, instalações elétricas residenciais, assistência a '
            'telemóveis (apenas software) e formação em Word, Excel e PowerPoint.'
        ),
    ),
    dict(
        titulos_antigos=['Defesa da Monografia Final de Curso'],
        title='Defesa da monografia de fim de curso',
        organization='Universidade Metodista Unida de Moçambique', location='Moçambique',
        experience_type='certification', start=(2026, 7, 24), end=(2026, 7, 24), order=3,
        description='Defesa pública do projeto final de Engenharia Informática e Tecnologias, com nota 14.',
    ),
]

# Entradas que podem ser cópias antigas. O comando só avisa; apaga no painel, se for o caso.
EXPERIENCIA_DUPLICADA = [
    'Técnico de Redes, Eletricista e Prestador de Serviços Técnicos',
    'Defesa do Trabalho de Conclusão de Curso',
]

# nome antigo -> nome novo (só muda a escrita, o nível fica como está)
COMPETENCIAS_RENOMEAR = {
    'C/C++ (Embarcados)': 'C/C++ (sistemas embebidos)',
    'Hardware & Diagnóstico de Computadores': 'Hardware e diagnóstico de computadores',
    'Fusão de Fibra Óptica': 'Fusão de fibra ótica',
    'Eletrónica Aplicada': 'Eletrónica',
    'Git & GitHub': 'Git e GitHub',
}

# Só são criadas se a tabela de competências estiver vazia.
COMPETENCIAS_BASE = [
    ('SQLite', 'backend', 90),
    ('C/C++ (sistemas embebidos)', 'embedded', 92),
    ('Microcontroladores (Arduino, Raspberry Pi)', 'embedded', 90),
    ('Eletrónica', 'embedded', 88),
    ('Hardware e diagnóstico de computadores', 'tools', 90),
    ('Redes de Computadores', 'network', 92),
    ('Fusão de fibra ótica', 'network', 88),
    ('Git e GitHub', 'tools', 88),
    ('Linux', 'tools', 85),
    ('Windows', 'tools', 85),
    ('Python (Django / DRF)', 'backend', 65),
    ('PostgreSQL', 'backend', 60),
    ('MySQL', 'backend', 60),
    ('React', 'frontend', 60),
    ('Next.js', 'frontend', 40),
    ('Tailwind CSS', 'frontend', 40),
    ('TypeScript', 'frontend', 35),
]
