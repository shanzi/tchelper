# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20150327_0725'),
    ]

    operations = [
        migrations.AlterField(
            model_name='problemassignment',
            name='status',
            field=models.CharField(default=b'new', max_length=10, choices=[(b'new', b'Unsolved problem'), (b'solved', b'Solved problem'), (b'overdue', b'Overdue problem'), (b'toreview', b'Problem to review'), (b'reviewed', b'Reviewed problem')]),
            preserve_default=True,
        ),
    ]
