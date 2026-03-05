from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

"""
	Backend d'authentification par email.
"""
class EmailBackend(ModelBackend):
    """
	Authentifie un utilisateur par email et mot de passe.

	@param request Requête HTTP
	@param username Email de l'utilisateur
	@param password Mot de passe en clair
	@return Instance User si valide, None sinon
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        User = get_user_model()
        try:
            user = User.objects.get(email=username)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None
