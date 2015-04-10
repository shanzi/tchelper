# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0017_auto_20150410_0751'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('difficulty', models.IntegerField(default=2, choices=[(0, b'Very Easy'), (1, b'Easy'), (2, b'Medium'), (3, b'Hard'), (4, b'Very Hard')])),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AlterField(
            model_name='problemcomment',
            name='datetime',
            field=models.DateTimeField(auto_now=True, auto_now_add=True, db_index=True),
            preserve_default=True,
        ),
    ]
