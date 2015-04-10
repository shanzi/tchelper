# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_problemcomment'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='problemcomment',
            options={'ordering': ('-datetime',)},
        ),
    ]
