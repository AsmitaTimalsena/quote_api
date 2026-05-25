from django.db import models

# Create your models here.

CATEGORY_CHOICES = [
    ('Motivation','Motivation'),
    ('Success','Success'),
    ('Life','Life'),

]
class Quote(models.Model):
    text = models.TextField()
    author = models.CharField(max_length=100)
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='Motivation'
    )

    def __str__(self):
        return self.author