# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_auto_20150410_0719'),
    ]

    operations = [
        migrations.AddField(
            model_name='problemcomment',
            name='raw_content',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
    ]
