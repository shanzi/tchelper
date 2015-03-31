from django import forms
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm as OriginUserCreateForm
from django.contrib.auth import login


class UserCreationForm(OriginUserCreateForm):
    email = forms.EmailField()


def index(request):
    return render(request, 'index.html')


def signup(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/')

    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            new_user = form.save()
            login(request, new_user)
            return HttpResponseRedirect('/')
    else:
        form = UserCreationForm()

    return render(request, 'registration/signup.html', {
        'form': form,
    })
