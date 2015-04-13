import requests
from StringIO import StringIO

from django.conf import settings
from django.template.loader import render_to_string
from django.core.mail.message import sanitize_address
from django.core.mail.backends.base import BaseEmailBackend


def html_email_body_for_sheet(sheet, base_url=None):
    base_url = base_url or settings.EMAIL_BASE_URL
    problems = sheet.problems.order_by('points').values()
    data = {
        'base_url': base_url,
        'number': sheet.number,
        'date': sheet.date,
        'overdue': [p for p in problems if p['type'] == 'overdue'],
        'new': [p for p in problems if p['type'] == 'new'],
        'review': [p for p in problems if p['type'] == 'review'],
    }
    return render_to_string('sheet_email_body.html', data)


def text_email_body_for_sheet(sheet, base_url=None):
    base_url = base_url or settings.EMAIL_BASE_URL
    problems = sheet.problems.order_by('points').values()
    data = {
        'base_url': base_url,
        'number': sheet.number,
        'date': sheet.date,
        'overdue': [p for p in problems if p['type'] == 'overdue'],
        'new': [p for p in problems if p['type'] == 'new'],
        'review': [p for p in problems if p['type'] == 'review'],
    }
    return render_to_string('sheet_email_body.text', data)


class MailgunEmailBackEnd(BaseEmailBackend):

    def open(self):
        pass

    def close(self):
        pass

    def _send_message(self, email_message):
        from_email = sanitize_address(email_message.from_email, email_message.encoding)
        recipients = [sanitize_address(addr, email_message.encoding) for addr in email_message.recipients()]
        r = requests.post(
            settings.MAILGUN_URL,
            auth=("api", settings.MAILGUN_KEY),
            data = {
                'form': from_email,
                'to': recipients,
            },
            files = {
                'message': StringIO(email_message.message().as_string())
            })
        return r.ok

    def send_messages(self, email_messages):
        return sum(1 for msg in email_messages if self._send_message(msg))
