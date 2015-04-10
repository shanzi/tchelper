from django.contrib.auth.models import User

from rest_framework import serializers

from api.models import (
    Problem,
    ProblemAssignment,
    ProblemSheet,
    ProblemComment,
)

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'email')


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


class ProblemCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return ProblemComment.objects.create(**validated_data)

    class Meta:
        model = ProblemComment
