from rest_framework import serializers

from api.models import (
    Problem,
    ProblemAssignment,
    ProblemSheet,
)


class ProblemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Problem


class ProblemAssignmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProblemAssignment


class ProblemSheetSerializer(serializers.ModelSerializer):
    problems = ProblemAssignmentSerializer(many=True, read_only=True)
    is_last = serializers.BooleanField()

    class Meta:
        model = ProblemSheet
