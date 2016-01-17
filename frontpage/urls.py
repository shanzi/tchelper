from django.conf.urls import patterns, include, url
from .forms import AuthenticationForm

urlpatterns = patterns(
    '',
    url(r'^$', 'frontpage.views.index'),
    url(r'^i/.*$', 'frontpage.views.app', name='app'),
    url(r'^account/login/$', 'django.contrib.auth.views.login', name='login', kwargs=dict(
        authentication_form=AuthenticationForm
    )),
    url(r'^account/logout/$', 'django.contrib.auth.views.logout', name='logout'),
    url(r'^account/signup/$', 'frontpage.views.signup', name='signup'),
    url(r'^account/activate/$', 'frontpage.views.activate', name='activate'),
    url(r'^account/deactivate/$', 'frontpage.views.deactivate', name='deactivate'),
    url(r'^account/password_change/$', 'django.contrib.auth.views.password_change', name='password_change'),
    url(r'^account/password_change/done/$', 'django.contrib.auth.views.password_change_done', name='password_change_done'),
    url(r'^account/password_reset/$', 'django.contrib.auth.views.password_reset', name='password_reset'),
    url(r'^account/password_reset/done/$', 'django.contrib.auth.views.password_reset_done', name='password_reset_done'),
    url(r'^account/reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        'django.contrib.auth.views.password_reset_confirm',
        name='password_reset_confirm'),
    url(r'^account/reset/done/$', 'django.contrib.auth.views.password_reset_complete', name='password_reset_complete'),
)
