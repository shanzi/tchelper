from django.db import models, transaction
from django.contrib.auth.models import User


class Problem(models.Model):
    problemId = models.IntegerField(primary_key=True)
    problemName = models.CharField(max_length=128, db_index=True)
    problemStatement = models.TextField()

    points = models.IntegerField(db_index=True)
    tags = models.CharField(max_length=128, db_index=True)

    date = models.DateField(db_index=True)


class ProblemSheet(models.Model):
    number = models.IntegerField(db_index=True)
    user = models.ForeignKey(User, related_name="sheets")
    date = models.DateField(auto_now_add=True)

    @classmethod
    @transaction.atomic
    def add(cls, user):
        return cls.objects.create(
            number=user.sheets.count() + 1,
            user=user
        )

    @transaction.atomic
    def auto_assign_problems(self):
        if self.problems.count() > 0: return

        overdues = ProblemAssignment.objects.filter(
            sheet__user=self.user,
            status__in=('new', 'overdue')
        ).all()

        for overdue in overdues:
            ProblemAssignment.assign_problem(overdue.originProblem, self, 'overdue')

        reviews = ProblemAssignment.objects.filter(
            sheet__user=self.user,
            status='solved'
        ).order_by('?').all()[:2]

        for review in reviews:
            ProblemAssignment.assign_problem(review.originProblem, self, 'toreview')

        total = len(overdues) + len(reviews)
        if total < 12:
            allassigns = ProblemAssignment.objects.filter(
                sheet__user=self.user
            ).values_list('originProblem', flat=True)
            allassigns = set(allassigns)
            newproblems = Problem.objects.exclude(problemId__in=allassigns).order_by('?').all()[:12-total]
            for problem in newproblems:
                ProblemAssignment.assign_problem(problem, self)


class ProblemAssignment(models.Model):
    sheet = models.ForeignKey(ProblemSheet, related_name="problems")
    originProblem = models.ForeignKey(Problem, related_name="assignments")
    problemName = models.CharField(max_length=128)
    points = models.IntegerField()
    tags = models.CharField(max_length=128)
    date = models.DateField()
    status = models.CharField(max_length=10, default='new', choices=(
        ('new', 'Unsolved problem'), 
        ('solved', 'Solved problem'),
        ('overdue', 'Overdue problem'), 
        ('toreview', 'Problem to review'),
        ('reviewed', 'Reviewed problem'),
    ))

    @classmethod
    def assign_problem(cls, problem, sheet, status='new'):
        return cls.objects.create(
            sheet=sheet,
            originProblem=problem,
            problemName=problem.problemName,
            points=problem.points,
            tags=problem.tags,
            date=problem.date,
            status=status
        )

    @transaction.atomic
    def done_problem(self):
        ProblemAssignment.objects.filter(
            sheet__user=self.sheet.user,
            originProblem=self.originProblem,
            status__in=('toreview', 'solved'),
        ).update(status='reviewed')
        ProblemAssignment.objects.filter(
            sheet__user=self.sheet.user,
            originProblem=self.originProblem,
            status__in=('new', 'overdue'),
        ).update(status='solved')
