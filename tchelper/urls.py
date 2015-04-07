from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static

urlpatterns = patterns(
    '',
    # Examples:
    url(r'^$', 'frontpage.views.index'),
    url(r'^i/.*$', 'frontpage.views.app', name='app'),
    url(r'^api/', include('api.urls')),
    url(r'^account/', include('django.contrib.auth.urls')),
    url(r'^account/signup/$', 'frontpage.views.signup', name='signup'),
    url(r'^account/activate/$', 'frontpage.views.activate', name='activate'),
    url(r'^account/deactivate/$', 'frontpage.views.deactivate', name='deactivate'),
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
