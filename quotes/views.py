import random
import json
from google import genai

from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Quote
from .serializers import QuoteSerializer


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

    if not message:
        return Response({"error": "Message is required"}, status=400)

    detected_mood = None
    ai_quote_text = None
    raw = ""

    try:
        # Initialize client inside the view so a missing key doesn't crash the app on startup
        client = genai.Client(api_key=settings.GEMINI_KEY)

        prompt = f"""
You are a mood analyzer and quote generator.

User message:
"{message}"

TASK:
1. Detect mood from this list:
Motivation, Success, Life, Failure, Happiness, Sadness,
Stress, Confidence, Hope, Friendship, Love, Education,
Career, Leadership, Discipline, Perseverance, SelfGrowth

2. Generate ONE motivational quote for that mood.

IMPORTANT: Return ONLY a raw JSON object. No markdown. No code fences. No backticks. No explanation. Just the JSON.

{{"mood": "...", "quote": "..."}}
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        raw = response.text.strip()
        print(f"Gemini raw response: {repr(raw)}")

        # Strip markdown code fences if present
        if "```" in raw:
            raw = raw.split("```")[1]
            if raw.lower().startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        data = json.loads(raw)
        detected_mood = data["mood"]
        ai_quote_text = data["quote"]

        print(f"Detected mood: {detected_mood} | Quote: {ai_quote_text}")

    except json.JSONDecodeError as e:
        print(f"Gemini JSON parse error: {e} | raw was: {repr(raw)}")
    except Exception as e:
        print(f"Gemini error: {type(e).__name__}: {e}")

    # Only filter community quotes if Gemini succeeded
    community_quote = None
    if detected_mood:
        matching_quotes = Quote.objects.filter(category__iexact=detected_mood)
        if matching_quotes.exists():
            quote = random.choice(list(matching_quotes))
            community_quote = {
                "text": quote.text,
                "author": quote.author,
                "category": quote.category,
            }

    return Response({
        "mood": detected_mood,
        "ai_quote": {
            "text": ai_quote_text or "Could not generate a quote. Please try again.",
            "author": "Gemini AI",
        },
        "community_quote": community_quote,
    })