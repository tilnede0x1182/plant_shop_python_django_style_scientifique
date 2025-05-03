from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from plant_shop.models import Plant, Order, OrderItem
from faker import Faker
import random, pathlib

class Command(BaseCommand):
    help = "Equivalent seeds.rb"

    def handle(self, *args, **opts):
        self.stdout.write("🔄 Initialisation de la seed...")
        fake = Faker("fr_FR")
        txt = pathlib.Path("users.txt").open("w", encoding="utf-8")
        self.stdout.write("🧹 Suppression des données existantes...")
        OrderItem.objects.all().delete()
        Order.objects.all().delete()
        Plant.objects.all().delete()
        User = get_user_model()
        User.objects.all().delete()

        self.stdout.write("👤 Création des utilisateurs...")
        admins, users = [], []
        for i in range(3):
            admins.append(User.objects.create_user(
                email=f"admin{i+1}@plantshop.com",
                password="password", admin=True, name=fake.name()))

        for _ in range(20):
            users.append(User.objects.create_user(
                email=fake.unique.email(), password="password",
                admin=False, name=fake.name()))

        txt.write("Liste des utilisateurs générés :\n")
        txt.write("\nAdmins\n\n");  [txt.write(f"{u.email} password\n") for u in admins]
        txt.write("\nUtilisateurs normaux\n\n"); [txt.write(f"{u.email} password\n") for u in users]; txt.close()

        self.stdout.write("🌱 Création des plantes...")
        plants=[]
        for _ in range(30):
            plants.append(Plant.objects.create(
                name=" ".join(fake.words(2)), price=random.randint(5,50),
                description=fake.sentence(nb_words=10), stock=random.randint(5,30)))

        self.stdout.write("🧾 Création des commandes...")
        for u in admins+users:
            o = Order.objects.create(user=u, total_price=0,
                                     status=random.choice(["confirmed","pending","shipped","delivered"]))
            total=0
            for _ in range(2):
                p=random.choice(plants); qty=min(random.randint(1,5),p.stock)
                if qty==0: continue
                OrderItem.objects.create(order=o, plant=p, quantity=qty)
                p.stock-=qty; p.save(update_fields=["stock"])
                total+=p.price*qty
            o.total_price=total; o.save(update_fields=["total_price"])
        self.stdout.write("✅ Seed terminée.")
