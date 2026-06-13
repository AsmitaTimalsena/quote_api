from django.urls import path
from .views import add_quote, all_quotes, mood_quote

urlpatterns = [
    path('quotes/', add_quote),
    path('quotes/mood/', mood_quote),
    path('quotes/all/', all_quotes),
]
