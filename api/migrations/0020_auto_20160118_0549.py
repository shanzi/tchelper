# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_problem_matchname'),
    ]

    operations = [
        migrations.AlterField(
            model_name='problem',
            name='matchName',
            field=models.CharField(max_length=128, db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='problem',
            name='problemName',
            field=models.CharField(max_length=256, db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='problem',
            name='tags',
            field=models.CharField(max_length=512, db_index=True),
            preserve_default=True,
        ),
    ]
