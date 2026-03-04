# RAPPORT D'ANALYSE DES DUPLICATIONS DE CODE (Principe DRY)

## Introduction
Variante « style scientifique » du backend Django.

---

## Violations DRY

### 1. Vues admin/public copiées-collées - 🔴 Critique
Dans `plant_shop/views.py`, les fonctions `plant_index`/`admin_plants_index`, `admin_plants_new/edit/delete`, `admin_users_*` répliquent la même logique (queryset trié, modelform_factory, flash) avec uniquement des templates différents. Toute évolution (validation, message) doit donc être synchronisée manuellement entre ces fonctions.

### 2. Modelform Factory répété dans chaque action - 🟠 Haute
Pour chaque action admin (`admin_plants_new`, `admin_plants_edit`, `admin_users_new`, `admin_users_edit`) on recrée un `modelform_factory` local, parfois deux fois par vue. Cela duplique les définitions de champs et empêche la personnalisation (widgets, labels). **Action** : définir des formulaires dédiés dans `forms.py` (ex. `PlantAdminForm`, `UserAdminForm`) réutilisés partout.

### 3. Commande `seed.py` : fonctions quasi identiques - 🟠 Haute
Les helpers `creer_admins` et `creer_users` diffèrent uniquement par le flag `admin`. Idem pour la boucle de création des commandes. **Action** : mutualiser via `create_fake_users(count, *, admin=False)` et `generate_orders(users, plants)` pour éviter d’avoir deux copies du même algorithme.

---

## Impact estimé

| Refactoring proposé                               | Lignes supprimées | Complexité |
|---------------------------------------------------|-------------------|------------|
| CBV/services partagés pour l’admin                | ~120              | Moyenne    |
| Formulaires dédiés plutôt que `modelform_factory` | ~40               | Faible     |
| Helpers de seed factorisés                        | ~40               | Faible     |

---

## Conclusion
Tout comme la version Django « standard », cette variante reproduit la même logique dans de multiples vues et helpers. Centraliser formulaires, services et seeders est indispensable pour respecter le principe DRY.***
