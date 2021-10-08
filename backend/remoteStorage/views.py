from django.shortcuts import render

def idnex(request):
    return render(request, 'index.html')

