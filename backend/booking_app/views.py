from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Treatment, Slot, Booking
from .serializers import TreatmentSerializer, SlotSerializer, BookingSerializer


@api_view(["GET"])
def get_treatments(request):
    treatments = Treatment.objects.all()
    serializer = TreatmentSerializer(treatments, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_slots(request):
    slots = Slot.objects.all().order_by("start_time")
    serializer = SlotSerializer(slots, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def book_slot(request):
    data = request.data
    slot_id = data.get("slot_id")
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    phone = data.get("phone")
    treatment_id = data.get("treatment_id")

    try:
        slot = Slot.objects.get(id=slot_id)
        if slot.status == "booked" or slot.blocked_by_admin:
            return Response({"success": False, "message": "Termin nije dostupan"})

        treatment = Treatment.objects.get(id=treatment_id)
        booking = Booking.objects.create(
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            treatment=treatment
        )
        slot.status = "booked"
        slot.booked_by = booking
        slot.save()

        return Response({"success": True, "treatment_name": treatment.name})
    except Slot.DoesNotExist:
        return Response({"success": False, "message": "Termin ne postoji"})


# endpoint za admin blokiranje termina
@api_view(["POST"])
def block_slot(request):
    data = request.data
    slot_id = data.get("slot_id")
    reason = data.get("reason", "Privatni termin")

    try:
        slot = Slot.objects.get(id=slot_id)
        slot.blocked_by_admin = True
        slot.blocked_reason = reason
        slot.save()
        return Response({"success": True, "message": "Termin blokiran"})
    except Slot.DoesNotExist:
        return Response({"success": False, "message": "Termin ne postoji"})
