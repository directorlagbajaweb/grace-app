export type Helpline = {
  name: string;
  descriptor: string;
  phone: string;
  tollFree: boolean;
  contactMethod: 'call' | 'whatsapp';
};

export const HELPLINES: Helpline[] = [
  {
    name: 'SURPIN',
    descriptor: '24hr · counselling',
    phone: '09034400009',
    tollFree: false,
    contactMethod: 'call',
  },
  {
    name: 'MANI',
    descriptor: 'Mon–Fri 9am–5pm · WhatsApp',
    phone: '09168417413',
    tollFree: false,
    contactMethod: 'whatsapp',
  },
  {
    name: '112',
    descriptor: 'Emergency services',
    phone: '112',
    tollFree: true,
    contactMethod: 'call',
  },
];
