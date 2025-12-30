import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Form } from 'react-bootstrap';

function AdminDashboard() {
  const [slots, setSlots] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [blockReason, setBlockReason] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("/api/slots/").then(res => res.json()).then(setSlots);
    fetch("/api/treatments/").then(res => res.json()).then(setTreatments);
  }

  const getTreatmentName = (id) => treatments.find(t => t.id === id)?.name || '';

  const blockSlot = (slotId) => {
    if (!blockReason) {
      alert("Unesite razlog blokade");
      return;
    }

    fetch("/api/block/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot_id: slotId, reason: blockReason })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        fetchData();
        setBlockReason('');
      } else alert(data.message);
    });
  }

  return (
    <Container className="p-3">
      <h3 className="text-center mb-3">Admin Dashboard</h3>

      <Form className="mb-3">
        <Form.Control placeholder="Razlog blokade" value={blockReason} onChange={e => setBlockReason(e.target.value)} />
      </Form>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Ime</th>
            <th>Prezime</th>
            <th>Telefon</th>
            <th>Tretman</th>
            <th>Početak</th>
            <th>Kraj</th>
            <th>Status</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {slots.map(s => (
            <tr key={s.id}>
              <td>{s.booked_by?.first_name || '-'}</td>
              <td>{s.booked_by?.last_name || '-'}</td>
              <td>{s.booked_by?.phone || '-'}</td>
              <td>{s.booked_by ? getTreatmentName(s.booked_by.treatment.id) : '-'}</td>
              <td>{new Date(s.start_time).toLocaleString()}</td>
              <td>{new Date(s.end_time).toLocaleTimeString()}</td>
              <td>{s.status}{s.blocked_by_admin ? ', Blokirano' : ''}</td>
              <td>
                {(!s.booked_by && !s.blocked_by_admin) &&
                  <Button variant="warning" onClick={() => blockSlot(s.id)}>Blokiraj</Button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminDashboard;
