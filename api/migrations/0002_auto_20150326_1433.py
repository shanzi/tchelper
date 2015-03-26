# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='problem',
            old_name='problemDescription',
            new_name='problemStatement',
        ),
        migrations.RemoveField(
            model_name='problem',
            name='accuracy',
        ),
        migrations.RemoveField(
            model_name='problem',
            name='componentId',
        ),
        migrations.RemoveField(
            model_name='problem',
            name='difficulty',
        ),
        migrations.RemoveField(
            model_name='problem',
            name='divisionId',
        ),
        migrations.RemoveField(
            model_name='problem',
            name='problemType',
        ),
        migrations.RemoveField(
            model_name='problem',
            name='roomId',
        ),
        migrations.AlterField(
            model_name='problem',
            name='status',
            field=models.CharField(default=b'New', max_length=16),
            preserve_default=True,
        ),
    ]
