import express from "express";
import { z } from "zod";
import type { Catalogue, Product } from "../catalogue";

const contact = z
  .object({
    productId: z.string().max(64),
    name: z.string().trim().min(1).max(100),
    email: z.email().max(254),
    message: z.string().trim().max(2000),
  })
  .strict();
export type Enquiry = z.infer<typeof contact>;
export type Deliver = (product: Product, enquiry: Enquiry) => Promise<void>;

export function createApp(load: () => Promise<Catalogue>, deliver: Deliver) {
  const app = express();
  app.disable("x-powered-by");
  app.use("/api", express.json({ limit: "16kb" }));
  app.get("/api/catalogue", async (_req, res) => {
    res.json(await load());
  });
  app.post("/api/enquiries", async (req, res) => {
    const parsed = contact.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: "Check the contact details and message length." });
      return;
    }
    const product = (await load()).products.find(
      (item) => item.id === parsed.data.productId,
    );
    if (!product) {
      res.status(404).json({ error: "Product not found." });
      return;
    }
    try {
      await deliver(product, parsed.data);
    } catch {
      res
        .status(503)
        .json({ error: "The sales inbox is unavailable. Please try again." });
      return;
    }
    res.status(201).json({ sent: true });
  });
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "Unknown endpoint." });
  });
  const handleError: express.ErrorRequestHandler = (err, _req, res, _next) => {
    const status = err.status === 413 ? 413 : err.status === 400 ? 400 : 500;
    res
      .status(status)
      .json({
        error:
          status === 500 ? "Catalogue unavailable." : "Invalid request body.",
      });
  };
  app.use(handleError);
  return app;
}
