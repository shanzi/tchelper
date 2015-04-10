# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0012_problemassignment_done_at'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProblemComment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('content', models.TextField()),
                ('datetime', models.DateTimeField(auto_now=True, auto_now_add=True)),
                ('problem', models.ForeignKey(related_name='comments', to='api.Problem')),
                ('user', models.ForeignKey(related_name='users', to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
