from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, name="", admin=False):
        if not email:
            raise ValueError("L'email est requis")
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, admin=admin)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, name=""):
        return self.create_user(email=email, password=password, name=name, admin=True)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=150, blank=True)
    admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email

    @property
    def is_staff(self):
        return self.admin

class Plant(models.Model):
    name        = models.CharField(max_length=100)
    price       = models.PositiveIntegerField()
    description = models.TextField()
    stock       = models.PositiveIntegerField()
    def __str__(self): return self.name

class Order(models.Model):
    STATUS = [("confirmed","confirmed"),("pending","pending"),
              ("shipped","shipped"),("delivered","delivered")]
    user        = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    total_price = models.PositiveIntegerField(default=0)
    status      = models.CharField(max_length=10, choices=STATUS)
    created_at  = models.DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
    order    = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    plant    = models.ForeignKey(Plant, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
