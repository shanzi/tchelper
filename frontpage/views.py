from django import forms
from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm as OriginUserCreateForm
from django.contrib.auth.decorators import login_required


class UserCreationForm(OriginUserCreateForm):
    email = forms.EmailField()


def index(request):
    if request.user.is_authenticated():
        return redirect('app')
    else:
        return render(request, 'index.html')


@login_required
def app(request):
    if request.user.is_active:
        return render(request, 'app.html')
    else:
        return redirect('activate')


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


@login_required
def deactivate(request):
    if request.method == 'POST':
        request.user.is_active = False
        request.user.save()
        return redirect('activate')
    return render(request, 'registration/deactivate.html')


@login_required
def activate(request):
    if request.method == 'POST':
        request.user.is_active = True
        request.user.save()
        return redirect('app')
    return render(request, 'registration/activate.html')
