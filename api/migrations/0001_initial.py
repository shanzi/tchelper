# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Problem',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('problemId', models.IntegerField(unique=True)),
                ('problemName', models.CharField(max_length=128, db_index=True)),
                ('problemType', models.CharField(max_length=32, db_index=True)),
                ('problemDescription', models.TextField()),
                ('points', models.IntegerField(db_index=True)),
                ('difficulty', models.CharField(max_length=10)),
                ('status', models.CharField(max_length=16)),
                ('myPoints', models.IntegerField(default=0)),
                ('accuracy', models.FloatField()),
                ('roundId', models.IntegerField()),
                ('roomId', models.IntegerField()),
                ('componentId', models.IntegerField()),
                ('divisionId', models.IntegerField(db_index=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
