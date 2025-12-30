import os
import django
from datetime import datetime, timedelta

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "beauty_booking.settings")
django.setup()

from models import Treatment, Slot


def run():
    # kreiraj tretmane
    treatments = [
        {"name": "Depilacija nogu", "duration_minutes": 60},
        {"name": "Depilacija prepona", "duration_minutes": 45},
        {"name": "Depilacija ruku", "duration_minutes": 30},
        {"name": "Depilacija obrva", "duration_minutes": 15},
        {"name": "Depilacija brkova", "duration_minutes": 10},
        {"name": "Pedikir", "duration_minutes": 50},
        {"name": "Muške grudi", "duration_minutes": 40},
        {"name": "Muška leđa", "duration_minutes": 60},
    ]

    for t in treatments:
        Treatment.objects.get_or_create(name=t["name"], duration_minutes=t["duration_minutes"])

    print("Tretmani kreirani")

    # kreiraj termine (npr. sledećih 7 dana, svaki sat od 9 do 17)
    Slot.objects.all().delete()
    start_date = datetime.now().replace(hour=9, minute=0, second=0, microsecond=0)
    for day in range(7):
        for hour in range(9, 17):
            start = start_date + timedelta(days=day, hours=hour - 9)
            end = start + timedelta(hours=1)
            Slot.objects.create(start_time=start, end_time=end)

    print("Demo termini kreirani")


if __name__ == "__main__":
    run()
