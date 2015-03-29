from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from api.models import (
    Problem,
    ProblemSheet,
    ProblemAssignment,
)

from api.serializers import (
    ProblemSerializer,
    ProblemAssignmentSerializer,
    ProblemSheetSerializer,
)

from api.permissions import IsOwner


class ProblemViewSet(viewsets.ReadOnlyModelViewSet):

    paginate_by = 10
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
    permission_classes = (IsAuthenticated, )


class ProblemAssignmentViewSet(viewsets.ReadOnlyModelViewSet):

    paginate_by = 12
    queryset = ProblemAssignment.objects.all()
    serializer_class = ProblemAssignmentSerializer
    permission_classes = (IsAuthenticated, IsOwner)


class ProblemSheetViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = ProblemSheet.objects.all()
    serializer_class = ProblemSheetSerializer
    permission_classes = (IsAuthenticated, IsOwner)
