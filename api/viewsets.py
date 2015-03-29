from rest_framework import viewsets

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


class ProblemViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer


class ProblemAssignmentViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = ProblemAssignment.objects.all()
    serializer_class = ProblemAssignmentSerializer


class ProblemSheetViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = ProblemSheet.objects.all()
    serializer_class = ProblemSheetSerializer
