from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static

from rest_framework.routers import DefaultRouter

from api.viewsets import (
    UserProfileViewSet,
    ProblemViewSet,
    ProblemAssignmentViewSet,
    ProblemSheetViewSet,
    ProblemCommentViewSet,
)

router = DefaultRouter()

router.register('profile', UserProfileViewSet)
router.register('problems', ProblemViewSet)
router.register('assignments', ProblemAssignmentViewSet)
router.register('sheets', ProblemSheetViewSet, base_name='sheet')
router.register('comments', ProblemCommentViewSet)

urlpatterns = patterns('',
                       url(r'^', include(router.urls)),
                       url(r'^auth/', include('rest_framework.urls', namespace='rest_framework')),
                       )

if settings.DEBUG:
    urlpatterns += patterns('',
                            url(r'^test_html_email/(\d)$', 'api.views.test_html_email'),
                            url(r'^test_text_email/(\d)$', 'api.views.test_text_email'),
                            )
