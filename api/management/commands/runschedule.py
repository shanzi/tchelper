import time
import schedule
from optparse import make_option

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User

from api.models import ProblemSheet
from api import utils


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
    def new_sheet_job(self):
        users = User.objects.filter(is_active=True).all()
        for user in users:
            sheet = ProblemSheet.add(user)
            sheet.auto_assign_problems()
            print '* --> new sheet for %s' % user.username
            self.send_sheet_email(user, sheet)
            time.sleep(1)

    def send_sheet_email(self, user, sheet):
        text = utils.text_email_body_for_sheet(sheet)
        html = utils.html_email_body_for_sheet(sheet)
        mid = utils.send_mail([user.email],
                              '[TCHelper] Problem Sheet #%d' % sheet.number,
                              text, html)
        print '* --> mail sent to %s<%s> [%s]' % (user.username, user.email, mid)

    def handle(self, flush, *args, **kwargs):
        schedule.every().monday.at('00:30').do(self.new_sheet_job)

        if flush:
            print "Flushing all scheduled jobs..."
            schedule.run_all()
            return

        print "Running schedule..."
        while True:
            schedule.run_pending()
            time.sleep(60)
