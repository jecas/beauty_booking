import React, { useEffect, useState } from 'react';
import Push from 'push.js';
import { Container, Table, Button, Form } from 'react-bootstrap';

function BookingCalendar() {
  const [slots, setSlots] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState('');

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

  const getTreatmentName = (id) => treatments.find(t => t.id === id)?.name || '';

  return (
    <Container className="p-3">
      <h3 className="text-center mb-3">Rezerviši tretman (Desktop)</h3>
      <Form className="mb-3">
        <Form.Control placeholder="Ime" className="mb-2" value={firstName} onChange={e => setFirstName(e.target.value)} />
        <Form.Control placeholder="Prezime" className="mb-2" value={lastName} onChange={e => setLastName(e.target.value)} />
        <Form.Control placeholder="Broj telefona" className="mb-2" value={phone} onChange={e => setPhone(e.target.value)} />
        <Form.Select value={selectedTreatment} onChange={e => setSelectedTreatment(e.target.value)} className="mb-2">
          <option value="">Izaberi tretman</option>
          {treatments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </Form.Select>
      </Form>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Početak</th>
            <th>Kraj</th>
            <th>Status</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {slots.map(s => (
            <tr key={s.id}>
              <td>{new Date(s.start_time).toLocaleString()}</td>
              <td>{new Date(s.end_time).toLocaleTimeString()}</td>
              <td>{s.status}{s.blocked_by_admin ? ', Blokirano' : ''}</td>
              <td>
                <Button variant={s.status==='free'?'success':'secondary'} disabled={s.status!=='free' || s.blocked_by_admin} onClick={()=>bookSlot(s.id)}>
                  Rezerviši
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default BookingCalendar;
