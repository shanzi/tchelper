from django.contrib.auth.forms import AuthenticationForm as BaseAuthForm


class AuthenticationForm(BaseAuthForm):

    def confirm_login_allowed(self, user):
        pass
