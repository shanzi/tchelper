# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20150327_0801'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='problemassignment',
            name='status',
        ),
        migrations.AddField(
            model_name='problemassignment',
            name='done',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='problemassignment',
            name='type',
            field=models.CharField(default=b'new', max_length=10, choices=[(b'new', b'Unsolved problem'), (b'overdue', b'Overdue problem'), (b'review', b'Problem to review')]),
            preserve_default=True,
        ),
    ]
