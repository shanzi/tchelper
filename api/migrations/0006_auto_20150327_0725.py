# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0005_auto_20150327_0641'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProblemAssignment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('problemName', models.CharField(max_length=128)),
                ('points', models.IntegerField()),
                ('tags', models.CharField(max_length=128)),
                ('date', models.DateField()),
                ('status', models.CharField(default=b'new', max_length=10, choices=[(b'new', b'Unsolved problem'), (b'overdue', b'Overdue problem'), (b'review', b'Solved problem to review')])),
                ('originProblem', models.ForeignKey(related_name='assignments', to='api.Problem')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ProblemSheet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('number', models.IntegerField(db_index=True)),
                ('date', models.DateField(auto_now_add=True)),
                ('user', models.ForeignKey(related_name='sheets', to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='problemassignment',
            name='sheet',
            field=models.ForeignKey(related_name='problems', to='api.ProblemSheet'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='problem',
            name='date',
            field=models.DateField(db_index=True),
            preserve_default=True,
        ),
    ]
