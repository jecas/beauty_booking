import React, { useEffect, useState } from 'react';
import Push from 'push.js';
import { Container, Form, Button, Card } from 'react-bootstrap';

function MobileBooking() {
  const [slots, setSlots] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [selectedTreatment, setSelectedTreatment] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fetch("/api/treatments/").then(res => res.json()).then(setTreatments);
    fetch("/api/slots/").then(res => res.json()).then(setSlots);

    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');
    if (Push.Permission.has() !== Push.Permission.GRANTED) Push.Permission.request();
  }, []);

  const bookSlot = (slotId) => {
    if (!firstName || !lastName || !phone || !selectedTreatment) {
      alert("Popunite sva polja!");
      return;
    }

    fetch("/api/book/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slot_id: slotId,
        first_name: firstName,
        last_name: lastName,
        phone,
        treatment_id: selectedTreatment
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        Push.create("Rezervacija uspešna", {
          body: `Vaš termin za ${data.treatment_name} je rezervisan!`,
          timeout: 5000
        });
        fetch("/api/slots/").then(res => res.json()).then(setSlots);
        setFirstName('');
        setLastName('');
        setPhone('');
        setSelectedTreatment('');
      } else alert(data.message);
    });
  }

  return (
    <Container className="p-3">
      <h3 className="text-center mb-3">Rezerviši tretman</h3>
      <Card className="p-3 mb-3 shadow-sm">
        <Form>
          <Form.Control placeholder="Ime" className="mb-2" value={firstName} onChange={e => setFirstName(e.target.value)} />
          <Form.Control placeholder="Prezime" className="mb-2" value={lastName} onChange={e => setLastName(e.target.value)} />
          <Form.Control placeholder="Broj telefona" className="mb-2" value={phone} onChange={e => setPhone(e.target.value)} />
          <Form.Select value={selectedTreatment} onChange={e => setSelectedTreatment(e.target.value)} className="mb-2">
            <option value="">Izaberi tretman</option>
            {treatments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </Form.Select>
        </Form>
      </Card>

      {slots.map(s => (
        <Button key={s.id} className="w-100 mb-2" variant={s.status==='free'?'success':'secondary'} disabled={s.status!=='free' || s.blocked_by_admin} onClick={()=>bookSlot(s.id)}>
          {new Date(s.start_time).toLocaleString()} - {new Date(s.end_time).toLocaleTimeString()}
          ({s.status}{s.blocked_by_admin ? ', Blokirano' : ''})
        </Button>
      ))}
    </Container>
  );
}

export default MobileBooking;
