from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static

urlpatterns = patterns('')

if settings.DEBUG:
    urlpatterns += patterns('',
                            url(r'^test_html_email/(\d)$', 'api.views.test_html_email'),
                            url(r'^test_text_email/(\d)$', 'api.views.test_text_email'),
                            )
