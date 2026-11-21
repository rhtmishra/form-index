import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

const base = `http://127.0.0.1:${process.env.PORT || 3000}`;
const response = await fetch(`${base}/api/catalogue`);
assert.ok(response.ok);
const { products } = await response.json();
for (const product of products) {
  const image = await fetch(`${base}${product.image}`);
  assert.equal(image.headers.get('content-type'), 'image/webp');
  assert.ok((await image.arrayBuffer()).byteLength > 0);
}
const product = products[0];
const message = `Local delivery check ${randomUUID()}`;
const sent = await fetch(`${base}/api/enquiries`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ productId: product.id, name: 'Local reviewer', email: 'reviewer@example.test', message })
});
assert.equal(sent.status, 201);
const inbox = await (await fetch('http://127.0.0.1:1080/email')).json();
const received = inbox.find(email => email.text.includes(message));
assert.ok(received, 'Expected the new message in MailDev');
assert.equal(received.to[0].address, 'sales@form-index.test');
assert.ok(received.subject.includes(product.name));
console.log(`Verified ${products.length} images and SMTP delivery: ${received.subject}`);