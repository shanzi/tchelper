# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_auto_20150410_1437'),
    ]

    operations = [
        migrations.AddField(
            model_name='problem',
            name='matchName',
            field=models.CharField(default='', max_length=64, db_index=True),
            preserve_default=False,
        ),
    ]
