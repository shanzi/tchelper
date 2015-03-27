from django.test import TestCase
from django.contrib.auth.models import User

from api.models import ProblemSheet

class ProblemSheetTestCase(TestCase):
    fixtures = ('fixtures/problems.json',)

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@test.com',
            password='password')
        self.sheet1 = ProblemSheet.add(self.user)
        self.sheet2 = ProblemSheet.add(self.user)
        self.sheet3 = ProblemSheet.add(self.user)

    def test_sheet_number(self):
        self.assertEqual(self.sheet1.number, 1)
        self.assertEqual(self.sheet2.number, 2)
        self.assertEqual(self.sheet3.number, 3)

    def test_auto_assign_problems(self):
        self.sheet1.auto_assign_problems()

        # test generate 12 problems
        self.assertEqual(self.sheet1.problems.count(), 12)

        for i, problem in enumerate(self.sheet1.problems.all()):
            if i % 2 == 0: problem.done_problem()

        # test problems is done
        doneCount = self.sheet1.problems.filter(status='solved').count()
        self.assertEqual(doneCount, 6)

        # test toreview count
        toreviewCount = self.sheet1.problems.filter(status='toreview').count()
        self.assertEqual(toreviewCount, 0)

        self.sheet2.auto_assign_problems()

        # test sheet2 overdue problems
        overdueCount = self.sheet2.problems.filter(status='overdue').count()
        self.assertEqual(overdueCount, 6)

        # test sheet2 toreview problems
        toreviewCount = self.sheet2.problems.filter(status='toreview').count()
        self.assertEqual(toreviewCount, 2)

        for problem in self.sheet2.problems.all():
            problem.done_problem()

        doneCount = self.sheet1.problems.filter(status='solved').count()
        self.assertEqual(doneCount, 10)

        doneCount = self.sheet2.problems.filter(status='solved').count()
        self.assertEqual(doneCount, 10)

        reviewedCount = self.sheet2.problems.filter(status='reviewed').count()
        self.assertEqual(reviewedCount, 2)

        self.sheet3.auto_assign_problems()
        self.assertEqual(self.sheet3.problems.count(), 12)
        self.assertEqual(self.sheet3.problems.filter(status='new').count(), 10)
        self.assertEqual(self.sheet3.problems.filter(status='toreview').count(), 2)
