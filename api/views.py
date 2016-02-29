from django.http.response import HttpResponse

from api.models import ProblemSheet


def test_html_email(request, sheet_id):
    from api.utils import html_email_body_for_sheet
    sheet = ProblemSheet.objects.get(id=sheet_id)
    body = html_email_body_for_sheet(sheet, '//' + request.get_host())
    return HttpResponse(body)


def test_text_email(request, sheet_id):
    from api.utils import text_email_body_for_sheet
    sheet = ProblemSheet.objects.get(id=sheet_id)
    body = text_email_body_for_sheet(sheet, 'https://' + request.get_host())
    return HttpResponse(body)
