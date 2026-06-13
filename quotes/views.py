import os
import random
import google.generativeai as genai

from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Quote
from .serializers import QuoteSerializer

genai.configure(api_key=settings.GEMINI_KEY)

# Create your views here.
#post new quote
@api_view(['POST'])
def add_quote(request):
    serializer = QuoteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()

        return Response(serializer.data)
    return Response(serializer.errors)

@api_view(['GET'])
def all_quotes(request):
    quotes = Quote.objects.all()
    serializer = QuoteSerializer(quotes, many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
def mood_quote(request):

    message = request.data.get("message")
    if request.method == "GET":
        return Response({
            "message": "Send a POST request with a mood."
        })

    if not message:
        return Response(
            {"error": "Message is required"},
            status=400
        )

    model = genai.GenerativeModel("gemini-2.5-flash-lite")

    mood_prompt = f"""
    Analyze this message:

    "{message}"

    Choose ONLY one category from:

    Motivation
    Success
    Life
    Failure
    Happiness
    Sadness
    Stress
    Confidence
    Hope
    Friendship
    Love
    Education
    Career
    Leadership
    Discipline
    Perseverance
    SelfGrowth

    Return ONLY the category.
    """

    mood_response = model.generate_content(mood_prompt)

    detected_mood = mood_response.text.strip()

    matching_quotes = Quote.objects.filter(
        category__iexact=detected_mood
    )
    print("Detected mood:", detected_mood)
    print("Matching quotes:", matching_quotes.count())

    community_quote = None

    if matching_quotes.exists():

        quote = random.choice(matching_quotes)

        community_quote = {
            "text": quote.text,
            "author": quote.author,
            "category": quote.category
        }

    ai_prompt = f"""
    User says:

    "{message}"

    Mood category: {detected_mood}

    Generate ONE short motivational quote.

    Return only the quote text.
    """

    ai_response = model.generate_content(ai_prompt)

    return Response({
        "mood": detected_mood,

        "ai_quote": {
            "text": ai_response.text.strip(),
            "author": "Gemini AI"
        },

        "community_quote": community_quote
    })

# @api_view(['GET'])
# def community_quote(request):
#     quotes = Quote.objects.all()

#     if quotes.exists():
#         quote = random.choice(quotes)
#         serializer = QuoteSerializer(quote)
#         return Response(serializer.data)

#     return Response({"message": "No quotes found"})