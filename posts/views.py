from __future__ import unicode_literals

import json

from django.core import serializers
from django.shortcuts import render, redirect, reverse, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from posts.models import Post
from posts.forms import PostForm


# Create your views here.

def Index(request):
	return render(request, 'userfeed.html')

@method_decorator(csrf_exempt, name='dispatch')
class Posts(View):

    def get(self, request):
        data = serializers.serialize("json", Post.objects.all().order_by('-create_date'))
        return HttpResponse(data, content_type="application/json")

    def delete(self, request):
        data = json.loads(request.body)
        pk = data.get('pk')
        Post.objects.get(pk=pk).delete()
        response = json.dumps({'status': 'ok'})
        return HttpResponse(response, content_type="application/json")

    def post(self, request):
        data = json.loads(request.body)
        form = PostForm(data)
        if form.is_valid():
            new_post = form.save()
            response = serializers.serialize("json", [new_post])
        else:
            response = json.dumps({'errors': form.errors})
       
        return HttpResponse(response, content_type="application/json")
