"""
Ponto de entrada usado pelo Vercel para correr o Django como função serverless.
Não precisa mexer aqui — isto só liga o Django ao formato que o Vercel espera.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

from django.core.wsgi import get_wsgi_application

app = get_wsgi_application()
