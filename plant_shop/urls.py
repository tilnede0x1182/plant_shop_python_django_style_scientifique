from django.urls import path
from django.contrib.auth import views as auth_views
from . import views
from .views import LoginView

urlpatterns = [
    path("",                 views.plant_index,        name="root"),
    path("plants/",          views.plant_index,        name="plants_index"),
    path("plants/<int:pk>/", views.plant_show,         name="plant_show"),
    path("carts/",           views.cart_index,         name="cart_index"),
	path("profile/",         views.profile_view,       name="profile"),
    path("signup/",          views.signup,             name="signup"),
    path("logout/", auth_views.LogoutView.as_view(next_page="/"), name="logout"),
	path("orders/",          views.order_index,        name="orders_index"),
    path("orders/new/",      views.order_new,          name="order_new"),
    path("orders/create/",   views.order_create,       name="order_create"),
	path("accounts/login/", views.LoginView.as_view(), name="login"),
	path("manage/plants/", views.admin_plants_index, name="admin_plants"),
	path("manage/plants/new/", views.admin_plants_new, name="admin_plants_new"),
	path("manage/plants/<int:pk>/edit/", views.admin_plants_edit, name="admin_plants_edit"),
	path("manage/plants/<int:pk>/delete/", views.admin_plants_delete, name="admin_plants_delete"),
	path("manage/users/", views.admin_users_index, name="admin_users"),
	path("manage/users/<int:pk>/", views.admin_users_show, name="admin_users_show"),
	path("manage/users/new/", views.admin_users_new, name="admin_users_new"),
	path("manage/users/<int:pk>/edit/", views.admin_users_edit, name="admin_users_edit"),
	path("manage/users/<int:pk>/delete/", views.admin_users_delete, name="admin_users_delete"),
]
