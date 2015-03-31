from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns(
    '',
    # Examples:
    url(r'^$', 'frontpage.views.index'),
    url(r'^api/', include('api.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^account/', include('django.contrib.auth.urls')),
    url(r'^account/signup/$', 'frontpage.views.signup', name='signup'),
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
