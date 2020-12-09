from django.http import HttpResponse


def index(request):
    return HttpResponse("Jelou, Mundo. ¡Bienvenid@s al índice de UPOI Django!")
