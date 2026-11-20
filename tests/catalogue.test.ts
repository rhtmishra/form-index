import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { selectProducts } from "../src/catalogue";
import { loadCatalogue } from "../src/server/source";
import { createApp } from "../src/server/app";

test("home features five distinct chosen objects; every category has picks and additional objects", async () => {
  const catalogue = await loadCatalogue();
  const home = selectProducts(catalogue, "", "");
  assert.equal(new Set(home.featured.map((product) => product.id)).size, 5);
  for (const category of new Set(
    catalogue.products.map((product) => product.category),
  )) {
    const { featured, additional, matches } = selectProducts(
      catalogue,
      category,
      "",
    );
    assert.ok(featured.length && additional.length);
    assert.ok(matches.every((product) => product.category === category));
    assert.equal(new Set([...featured, ...additional]).size, matches.length);
  }
  assert.deepEqual(
    selectProducts(catalogue, "", "  READING ").matches.map(
      (product) => product.id,
    ),
    ["002"],
  );
  assert.deepEqual(selectProducts(catalogue, "", "no such object").matches, []);
});

test("HTTP contract: source, validation, canonical product, and delivery failure", async (context) => {
  const deliveries: string[] = [];
  let unavailable = false;
  const server = createApp(loadCatalogue, async (product, enquiry) => {
    if (unavailable) throw Error("SMTP offline");
    deliveries.push(`${product.name}:${enquiry.email}`);
  }).listen(0, "127.0.0.1");
  context.after(() => server.close());
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const base = `http://127.0.0.1:${address.port}/api`;
  assert.deepEqual(
    await (await fetch(`${base}/catalogue`)).json(),
    await loadCatalogue(),
  );
  const valid = {
    productId: "001",
    name: "Alex",
    email: "alex@example.test",
    message: "Available?",
  };
  const post = (body: object) =>
    fetch(`${base}/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  assert.equal((await post({ ...valid, email: "bad" })).status, 400);
  assert.equal((await post({ ...valid, productId: "missing" })).status, 404);
  assert.equal(
    (await post({ ...valid, to: "someone@example.test" })).status,
    400,
  );
  assert.equal((await post(valid)).status, 201);
  unavailable = true;
  assert.equal((await post(valid)).status, 503);
  assert.deepEqual(deliveries, ["Saarinen Executive Chair:alex@example.test"]);
});
