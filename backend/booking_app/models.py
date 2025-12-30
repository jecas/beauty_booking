from django.db import models


class Treatment(models.Model):
    name = models.CharField(max_length=100)
    duration_minutes = models.IntegerField(default=60)

    def __str__(self):
        return self.name


class Booking(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=20)
    treatment = models.ForeignKey(Treatment, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.treatment.name})"


class Slot(models.Model):
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=10, choices=[("free", "Free"), ("booked", "Booked")], default="free")
    booked_by = models.ForeignKey(Booking, null=True, blank=True, on_delete=models.SET_NULL,
                                  related_name="slot_booking")

    # nova polja za admin blokadu
    blocked_by_admin = models.BooleanField(default=False)
    blocked_reason = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"{self.start_time} - {self.end_time} ({self.status}, blocked={self.blocked_by_admin})"
