# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_auto_20150402_0304'),
    ]

    operations = [
        migrations.AddField(
            model_name='problemassignment',
            name='done_at',
            field=models.DateTimeField(null=True, blank=True),
            preserve_default=True,
        ),
    ]
