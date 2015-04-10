# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_auto_20150410_0738'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='problemcomment',
            name='raw_content',
        ),
        migrations.AlterField(
            model_name='problemcomment',
            name='content',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
    ]
