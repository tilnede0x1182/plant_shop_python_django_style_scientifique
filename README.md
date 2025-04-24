# 🌿 PlantShop

PlantShop est une application Django de e-commerce pour la vente de plantes. Elle propose une interface client et une interface d’administration pour gérer utilisateurs, produits et commandes.

## Fonctionnalités

- Authentification par email
- Interface d’administration pour la gestion des plantes et utilisateurs
- Catalogue public des plantes
- Panier client en localStorage
- Commandes avec suivi du statut

## Technologies

- Django ≥ 4.2
- SQLite
- HTML/CSS/JS (sans framework)
- Faker (génération de données de test)

## Installation

```bash
python -m venv venv
source venv/bin/activate  # ou .\venv\Scripts\activate sur Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py seed
python manage.py runserver
