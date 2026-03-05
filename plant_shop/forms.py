from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User

"""
	Formulaire d'inscription personnalisé.
	Utilise email et name au lieu de username.
"""
class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ["email", "name"]
