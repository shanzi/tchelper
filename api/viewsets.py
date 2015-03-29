from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import detail_route
from rest_framework.permissions import IsAuthenticated

from api.models import (
    Problem,
    ProblemStar,
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

    @detail_route(methods=['post'])
    def star(self, request, pk=None):
        problem = self.get_object()
        user = request.user
        star, created = ProblemStar.objects.get_or_create(
            problem=problem,
            user=user,
        )
        return Response({'status': 'ok', 'created': created})

    @detail_route(methods=['post'])
    def unstar(self, request, pk=None):
        problem = self.get_object()
        user = request.user
        ProblemStar.objects.filter(
            problem=problem,
            user=user,
        ).delete()
        return Response({'status': 'ok'})

    @detail_route(methods=['get'])
    def has_star(self, request, pk=None):
        problem = self.get_object()
        user = request.user
        try:
            star = ProblemStar.objects.get(
                problem=problem,
                user=user,
            )
            return Response({'has_star': True, 'datetime': star.datetime})
        except ProblemStar.DoesNotExist:
            return Response({'has_star': False})


class ProblemAssignmentViewSet(viewsets.ReadOnlyModelViewSet):

    paginate_by = 12
    queryset = ProblemAssignment.objects.all()
    serializer_class = ProblemAssignmentSerializer
    permission_classes = (IsAuthenticated, IsOwner)

    @detail_route(methods=['post', 'patch'])
    def done(self, request, pk=None):
        assignment = self.get_object()
        assignment.done_problem()
        return Response({'status': 'ok'})


class ProblemSheetViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = ProblemSheet.objects.all()
    serializer_class = ProblemSheetSerializer
    permission_classes = (IsAuthenticated, IsOwner)
