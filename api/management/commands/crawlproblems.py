import re
import time
import random
import pyquery

from datetime import date
from django.core.management.base import BaseCommand, CommandError

from api.models import Problem

class Command(BaseCommand):

    def level_to_int(self, string):
        return int(string.strip() or -1)

    def percent_to_float(self, string):
        if string:
            string = string.strip()
            if string[-1] == '%': string = string[:-1]
            return float(string)
        return -1

    def parse_date(self, string):
        ts = time.strptime(string, '%m.%d.%Y')
        return date(ts.tm_year, ts.tm_mon, ts.tm_mday)

    def url_for_problems(self, start, end):
        return "http://community.topcoder.com/tc?module=ProblemArchive&sr=%d&er=%d" % (start, end)

    def url_for_problem_statement(self, problemId):
        return "http://community.topcoder.com/stat?c=problem_statement&pm=%d" % problemId

    def points_for_problem(self, div1_level, div1_rate, div2_level, div2_rate):
        div1_point = 1000
        div2_point = 1000

        if div1_level > 0:
            div1_point = (70 - div1_rate) * 4 + div1_level * 200 + 200
        if div2_level > 0:
            div1_point = (50 - div2_rate) * 4 + div2_level * 200

        if div1_level > 0 and div2_level > 0:
            return int((div1_point + div2_point) / 2)
        else:
            return int(min(div1_point, div2_point))

    def simple_problems_for_url(self, url):
        pq = pyquery.PyQuery(url=url)
        tables = pq('table.paddingTable2')
        table = tables.eq(tables.length - 1)
        trs = table.children('tr')
        for i in range(3, len(trs) - 6):
            tr = trs.eq(i)
            td = tr.children('td')
            problemName = td.eq(1).text().strip()
            date = self.parse_date(td.eq(3).text().strip())
            tags = td.eq(5).text().strip()
            div1_level = self.level_to_int(td.eq(6).text())
            div1_rate = self.percent_to_float(td.eq(7).text())
            div2_level = self.level_to_int(td.eq(8).text())
            div2_rate = self.percent_to_float(td.eq(9).text())
            detail_url = td.eq(10).children('a').attr('href')
            problemId = int(re.search(r'pm=(\d+)', detail_url).groups()[0])
            points = self.points_for_problem(div1_level, div1_rate, div2_level, div2_rate)
            yield problemId, problemName, date, tags, points

    def clear_problem_statement(self, table):
        trs = table.children('tr')
        htmls = []
        inlistflag = False
        for i in range(trs.length):
            tr = trs.eq(i)
            td = tr.children('td')
            if td.length == 2 and td.eq(0).text().strip() == '-':
                if not inlistflag:
                    inlistflag = True
                    htmls.append('<ul>')
                htmls.append("<li>%s</li>" % td.eq(1).html().strip())
            else:
                if inlistflag:
                    inlistflag = False
                    htmls.append('</ul>')
                if td.length == 1:
                    htmls.append(td.eq(0).html())
                elif td.length == 2:
                    htmls.append(td.eq(1).html())

        return '\n'.join(filter(None, htmls))

    def problem_statement_with_id(self, pid):
        pq = pyquery.PyQuery(url=self.url_for_problem_statement(pid))
        table = pq('td.problemText').children('table')
        return self.clear_problem_statement(table)

    def handle_problems_for_range(self, start, end):
        print '-' * 20, ' ', start, ' - ', end, ' ', '-' * 20
        for pid, pname, date, tags, points in self.simple_problems_for_url(self.url_for_problems(start, end)):
            print pid, pname, date, tags, points
            time.sleep(random.randrange(5, 20))
            statement = self.problem_statement_with_id(pid)
            Problem.objects.get_or_create(
                problemId=pid,
                defaults=dict(
                    problemName=pname,
                    problemStatement=statement,
                    date=date,
                    tags=tags,
                    points=points
                ))

    def handle(self, *args, **kwargs):
        for i in range(0, 1000, 100):
            self.handle_problems_for_range(i + 1, i + 100)
            time.sleep(random.randrange(5, 20))
