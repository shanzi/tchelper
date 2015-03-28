import requests

from django.conf import settings
from django.template.loader import render_to_string


def html_email_body_for_sheet(sheet, base_url=None):
    base_url = base_url or settings.EMAIL_BASE_URL
    problems = sheet.problems.order_by('points').values()
    data = {
        'base_url': base_url,
        'number': sheet.number,
        'date': sheet.date,
        'overdue': [p for p in problems if p['type'] == 'overdue'],
        'new': [p for p in problems if p['type'] == 'new'],
        'review': [p for p in problems if p['type'] == 'toreview'],
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
        'review': [p for p in problems if p['type'] == 'toreview'],
    }
    return render_to_string('sheet_email_body.text', data)


def send_mail(toaddrs, subject, text_body, html_body=None):
    html_body = html_body or text_body
    r = requests.post(
        settings.MAILGUN_URL,
        auth=("api", settings.MAILGUN_KEY),
        data={"from": "TCHelper <no-reply@tch.io-meter.com>",
              "to": toaddrs,
              "subject": subject,
              "text": text_body,
              "html": html_body,
              })
    if r.ok:
        return r.json()['id']
    else:
        raise Exception('Failed to send email')
