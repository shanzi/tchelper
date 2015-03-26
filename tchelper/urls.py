from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static

urlpatterns = patterns('',
                       # Examples:
                       url(r'^$', 'frontpage.views.index'),
                       )
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
