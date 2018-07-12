# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Post(models.Model):
	content = models.CharField(max_length=200, blank=False)
	create_date = models.DateTimeField(auto_now_add=True)
