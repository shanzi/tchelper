from django.http.response import HttpResponse
from django.template.loader import render_to_string

from api.models import ProblemSheet


def email_body_for_sheet(sheet, base_url):
    problems = sheet.problems.order_by('points').values()
    data = {
        'base_url': base_url,
        'number': sheet.number,
        'date': sheet.date,
        'overdue': [p for p in problems if p['status'] == 'overdue'],
        'new': [p for p in problems if p['status'] == 'new'],
        'review': [p for p in problems if p['status'] == 'toreview'],
    }
    return render_to_string('sheet_email.html', data)


def test_email(request, sheet_id):
    sheet = ProblemSheet.objects.get(id=sheet_id)
    body = email_body_for_sheet(sheet, '//' + request.get_host())
    return HttpResponse(body)
