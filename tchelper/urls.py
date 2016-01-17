from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static

urlpatterns = patterns(
    '',
    url(r'^', include('frontpage.urls')),
    url(r'^api/', include('api.urls')),
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
