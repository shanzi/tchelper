# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20150326_1435'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='problem',
            name='roundId',
        ),
        migrations.AddField(
            model_name='problem',
            name='date',
            field=models.DateField(default=datetime.datetime(2015, 3, 26, 14, 44, 57, 123521, tzinfo=utc)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='problem',
            name='tags',
            field=models.CharField(default='', max_length=128, db_index=True),
            preserve_default=False,
        ),
    ]
