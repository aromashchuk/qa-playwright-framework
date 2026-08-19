import { type APIRequestContext, type APIResponse, expect } from '@playwright/test';

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
}

export class BookingApi {
  constructor(private readonly request: APIRequestContext) {}

  private authHeaders(token: string) {
    return { Cookie: `token=${token}` };
  }

  async authenticate(username = 'admin', password = 'password123'): Promise<string> {
    const res = await this.tryAuthenticate(username, password);
    expect(res.ok(), 'auth request should succeed').toBeTruthy();
    const token = (await res.json()).token as string;
    expect(token, 'auth should return a token').toBeTruthy();
    return token;
  }

  tryAuthenticate(username: string, password: string): Promise<APIResponse> {
    return this.request.post('/auth', { data: { username, password } });
  }

  async createBooking(booking: Booking): Promise<{ id: number; booking: Booking }> {
    const res = await this.request.post('/booking', { data: booking });
    expect(res.status(), 'create should return 200').toBe(200);
    const body = await res.json();
    return { id: body.bookingid, booking: body.booking };
  }

  getBooking(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  async getBookingIds(): Promise<Array<{ bookingid: number }>> {
    const res = await this.request.get('/booking');
    expect(res.status()).toBe(200);
    return res.json();
  }

  updateBooking(id: number, token: string, booking: Booking): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, { headers: this.authHeaders(token), data: booking });
  }

  partialUpdate(id: number, token: string, partial: Partial<Booking>): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, { headers: this.authHeaders(token), data: partial });
  }

  deleteBooking(id: number, token: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: this.authHeaders(token) });
  }
}
