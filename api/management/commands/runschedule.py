import time
import schedule
from optparse import make_option

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User

from api.models import ProblemSheet


def jobwrap(func):
    def wrap(*args, **kwargs):
        print '* [%s] started' % func.__name__
        try:
            func(*args, **kwargs)
        except Exception as e:
            print '* [%s] failed' % func.__name__
            print e.message
        else:
            print '* [%s] finished' % func.__name__
    return wrap


class Command(BaseCommand):
    option_list = BaseCommand.option_list + (
        make_option('--flush',
                    action='store_true',
                    default=False,
                    dest='flush',
                    help='Flush all pending jobs and exit'),
    )

    @jobwrap
    def newSheetJob(self):
        users = User.objects.all()
        for user in users:
            sheet = ProblemSheet.add(user)
            sheet.auto_assign_problems()
            print '* --> new sheet for %s' % user.username
            time.sleep(1)

    def handle(self, flush, *args, **kwargs):
        schedule.every().monday.do(self.newSheetJob)

        if flush:
            print "Flushing all scheduled jobs..."
            schedule.run_all()
            return

        print "Running schedule..."
        while True:
            schedule.run_pending()
            time.sleep(3600)
