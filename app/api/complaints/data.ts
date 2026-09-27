export let complaints = [
  {
    id: '1',
    subject: 'Delayed Delivery',
    description: 'My order #12345 has been delayed by 3 days and I have not received any updates.',
    status: 'Pending',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    subject: 'Damaged Product',
    description: 'The item I received yesterday had a huge scratch on the side.',
    status: 'Resolved',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  }
];
