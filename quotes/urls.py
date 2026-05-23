from django.urls import path
from .views import add_quote, random_quote

urlpatterns = [
    path('quotes/', add_quote),
    path('quotes/random/', random_quote),
]