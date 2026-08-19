import { test, expect } from '@playwright/test';
import { BookingApi, type Booking } from '../../src/api/BookingApi.js';

const sampleBooking: Booking = {
  firstname: 'Ada',
  lastname: 'Lovelace',
  totalprice: 240,
  depositpaid: true,
  bookingdates: { checkin: '2026-01-10', checkout: '2026-01-14' },
  additionalneeds: 'Breakfast',
};

const createPayloads: Booking[] = [
  {
    firstname: 'Grace',
    lastname: 'Hopper',
    totalprice: 300,
    depositpaid: true,
    bookingdates: { checkin: '2026-02-01', checkout: '2026-02-05' },
  },
  {
    firstname: 'Alan',
    lastname: 'Turing',
    totalprice: 150,
    depositpaid: false,
    bookingdates: { checkin: '2026-03-10', checkout: '2026-03-12' },
    additionalneeds: 'Late checkout',
  },
];

test.describe('Booking API', () => {
  test('health check responds', async ({ request }) => {
    const res = await request.get('/ping');
    expect(res.status()).toBe(201);
  });

  test('returns a non-empty list of booking ids', async ({ request }) => {
    const api = new BookingApi(request);
    const ids = await api.getBookingIds();
    expect(ids.length).toBeGreaterThan(0);
    expect(ids[0]).toHaveProperty('bookingid');
  });

  test('rejects bad credentials with no token', async ({ request }) => {
    const api = new BookingApi(request);
    const res = await api.tryAuthenticate('admin', 'wrong-password');
    expect(res.status()).toBe(200);
    expect((await res.json()).token).toBeUndefined();
  });

  test('create, read and delete a booking', async ({ request }) => {
    const api = new BookingApi(request);
    const token = await api.authenticate();

    const { id, booking } = await api.createBooking(sampleBooking);
    expect(id).toBeGreaterThan(0);
    expect(booking.firstname).toBe(sampleBooking.firstname);

    const getRes = await api.getBooking(id);
    expect(getRes.status()).toBe(200);
    expect((await getRes.json()).lastname).toBe(sampleBooking.lastname);

    const deleteRes = await api.deleteBooking(id, token);
    expect(deleteRes.status()).toBe(201);
    expect((await api.getBooking(id)).status()).toBe(404);
  });

  test('updates a booking with a valid token', async ({ request }) => {
    const api = new BookingApi(request);
    const token = await api.authenticate();
    const { id } = await api.createBooking(sampleBooking);

    const updated: Booking = { ...sampleBooking, firstname: 'Edith', lastname: 'Clarke' };
    const putRes = await api.updateBooking(id, token, updated);
    expect(putRes.status()).toBe(200);
    expect((await putRes.json()).firstname).toBe('Edith');

    await api.deleteBooking(id, token);
  });

  test('partially updates a booking', async ({ request }) => {
    const api = new BookingApi(request);
    const token = await api.authenticate();
    const { id } = await api.createBooking(sampleBooking);

    const patchRes = await api.partialUpdate(id, token, { firstname: 'Katherine' });
    expect(patchRes.status()).toBe(200);
    expect((await patchRes.json()).firstname).toBe('Katherine');

    await api.deleteBooking(id, token);
  });

  for (const payload of createPayloads) {
    test(`creates a booking for ${payload.firstname} ${payload.lastname}`, async ({ request }) => {
      const api = new BookingApi(request);
      const { id, booking } = await api.createBooking(payload);
      expect(id).toBeGreaterThan(0);
      expect(booking.firstname).toBe(payload.firstname);
    });
  }
});
