# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_problem_users'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='problemstar',
            options={'ordering': ('-datetime',)},
        ),
        migrations.AlterField(
            model_name='problemstar',
            name='datetime',
            field=models.DateTimeField(auto_now_add=True, db_index=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='problemstar',
            name='problem',
            field=models.ForeignKey(related_name='stars', to='api.Problem'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='problemstar',
            name='user',
            field=models.ForeignKey(related_name='stars', to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
        migrations.AlterUniqueTogether(
            name='problemstar',
            unique_together=set([('problem', 'user')]),
        ),
    ]
