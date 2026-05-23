import random
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Quote
from .serializers import QuoteSerializer

# Create your views here.
#post new quote
@api_view(['POST'])
def add_quote(request):
    serializer = QuoteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()

        return Response(serializer.data)
    return Response(serializer.errors)

#GET random quote
@api_view(['GET'])
def random_quote(request):
    quotes = Quote.objects.all()

    if quotes.exists():
        quote = random.choice(quotes)
        serializer = QuoteSerializer(quote)
        return Response(serializer.data)
    return Response({"message": "quote not found"})
