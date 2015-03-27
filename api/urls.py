from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static

urlpatterns = patterns('')

if settings.DEBUG:
    urlpatterns += patterns('', url(r'^test_email/(\d)$', 'api.views.test_email'))
