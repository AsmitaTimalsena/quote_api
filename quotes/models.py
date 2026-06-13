from django.db import models

CATEGORY_CHOICES = [
    ('Motivation', 'Motivation'),
    ('Success', 'Success'),
    ('Life', 'Life'),
    ('Failure', 'Failure'),
    ('Happiness', 'Happiness'),
    ('Sadness', 'Sadness'),
    ('Stress', 'Stress'),
    ('Confidence', 'Confidence'),
    ('Hope', 'Hope'),
    ('Friendship', 'Friendship'),
    ('Love', 'Love'),
    ('Education', 'Education'),
    ('Career', 'Career'),
    ('Leadership', 'Leadership'),
    ('Discipline', 'Discipline'),
    ('Perseverance', 'Perseverance'),
    ('SelfGrowth', 'Self Growth'),
]

class Quote(models.Model):
    text = models.TextField()
    author = models.CharField(max_length=100)
    category = models.CharField(
        max_length=30,
        choices=CATEGORY_CHOICES,
        default='Motivation'
    )

    def __str__(self):
        return self.author