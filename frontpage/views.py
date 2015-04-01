from django import forms
from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib.auth.forms import UserCreationForm as OriginUserCreateForm
from django.contrib.auth import login


class UserCreationForm(OriginUserCreateForm):
    email = forms.EmailField()


def index(request):
    if request.user.is_authenticated():
        return redirect('app')
    else:
        return render(request, 'index.html')


def app(request):
    return render(request, 'app.html')


def signup(request):
    if request.user.is_authenticated():
        return redirect('app')

    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            new_user = form.save()
            login(request, new_user)
            return redirect('app')
    else:
        form = UserCreationForm()

    return render(request, 'registration/signup.html', {
        'form': form,
    })
