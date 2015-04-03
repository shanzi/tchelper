from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from rest_framework.decorators import (
    list_route,
    detail_route
)

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

    paginate_by = 20
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
    permission_classes = (IsAuthenticated, )

    @list_route(methods=['get'])
    def starred(self, request):
        starred_problems = request.user.starred_problems.all()
        page = self.paginate_queryset(starred_problems)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response({})

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

    paginate_by = 20
    queryset = ProblemAssignment.objects.all()
    serializer_class = ProblemAssignmentSerializer
    permission_classes = (IsAuthenticated, IsOwner)

    @list_route(methods=['get'])
    def solved(self, request):
        solved_assignments = ProblemAssignment.objects.filter(
            sheet__user=request.user,
            type='new',
            done=True
        ).all()
        page = self.paginate_queryset(solved_assignments)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response({})

    @detail_route(methods=['post', 'patch'])
    def done(self, request, pk=None):
        assignment = self.get_object()
        assignment.done_problem()
        return Response({'status': 'ok'})


class ProblemSheetViewSet(viewsets.ReadOnlyModelViewSet):

    paginate_by = 10
    serializer_class = ProblemSheetSerializer
    permission_classes = (IsAuthenticated, IsOwner)
    lookup_field = 'number'

    def get_queryset(self):
        return self.request.user.sheets.all()

    @list_route(methods=['GET'])
    def latest(self, request):
        if self.request.user.sheets.count() > 0:
            latest_sheet = self.request.user.sheets.last()
            serializer = self.get_serializer(latest_sheet)
            return Response(serializer.data)
        else:
            return Response({})
