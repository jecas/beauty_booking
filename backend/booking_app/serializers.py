from rest_framework import serializers
from .models import Treatment, Slot, Booking

class TreatmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Treatment
        fields = ["id", "name", "duration_minutes"]

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ["id", "first_name", "last_name", "phone", "treatment"]

class SlotSerializer(serializers.ModelSerializer):
    booked_by = BookingSerializer(read_only=True)
    class Meta:
        model = Slot
        fields = ["id", "start_time", "end_time", "status", "booked_by", "blocked_by_admin", "blocked_reason"]
