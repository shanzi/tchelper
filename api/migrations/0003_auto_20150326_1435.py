# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20150326_1433'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='problem',
            name='id',
        ),
        migrations.AlterField(
            model_name='problem',
            name='problemId',
            field=models.IntegerField(serialize=False, primary_key=True),
            preserve_default=True,
        ),
    ]
