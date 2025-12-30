from django.urls import path
from . import views

urlpatterns = [
    path("api/treatments/", views.get_treatments),
    path("api/slots/", views.get_slots),
    path("api/book/", views.book_slot),
    path("api/block/", views.block_slot),  # novi endpoint za admin
]
