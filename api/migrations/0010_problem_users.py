# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0009_problemstar'),
    ]

    operations = [
        migrations.AddField(
            model_name='problem',
            name='users',
            field=models.ManyToManyField(related_name='starred_problems', through='api.ProblemStar', to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
    ]
