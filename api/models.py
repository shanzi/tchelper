from django.db import models


class Problem(models.Model):
    problemId = models.IntegerField(unique=True)
    problemName = models.CharField(max_length=128, db_index=True)
    problemType = models.CharField(max_length=32, db_index=True)
    problemDescription = models.TextField()

    points = models.IntegerField(db_index=True)
    difficulty = models.CharField(max_length=10)
    status = models.CharField(max_length=16)
    myPoints = models.IntegerField(default=0)
    accuracy = models.FloatField()

    roundId = models.IntegerField()
    roomId = models.IntegerField()
    componentId = models.IntegerField()
    divisionId = models.IntegerField(db_index=True)
