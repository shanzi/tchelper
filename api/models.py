from django.db import models


class Problem(models.Model):
    problemId = models.IntegerField(primary_key=True)
    problemName = models.CharField(max_length=128, db_index=True)
    problemStatement = models.TextField()

    points = models.IntegerField(db_index=True)
    status = models.CharField(max_length=16, default='New')
    myPoints = models.IntegerField(default=0)
    tags = models.CharField(max_length=128, db_index=True)

    date = models.DateField()
