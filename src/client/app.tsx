import { useEffect, useState, type FormEvent } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Armchair,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Coffee,
  Grid2X2,
  Layers3,
  Search,
  Star,
} from "lucide-react";
import { selectProducts, type Catalogue, type Product } from "../catalogue";
import "./style.css";

const params = new URLSearchParams(location.search);
const link = (key: string, value: string) =>
  `/?${new URLSearchParams({ [key]: value })}`;
const money = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
const pad = (value: number) => String(value).padStart(2, "0");

function Brand() {
  return (
    <a className="brand" href="/" aria-label="Form Index home">
      <span className="brandmark" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      Form Index<span className="period">.</span>
    </a>
  );
}

function Header() {
  return (
    <header>
      <div className="bar wrap">
        <Brand />
        <a className="nav" href="/?view=all">
          Catalogue <ArrowDownRight size={14} />
        </a>
        <form className="search" action="/" role="search">
          <input
            aria-label="Search objects"
            type="search"
            name="q"
            placeholder="Search objects..."
            maxLength={150}
            defaultValue={params.get("q") || ""}
          />
          <button title="Search catalogue" aria-label="Search catalogue">
            <Search size={18} />
          </button>
        </form>
      </div>
    </header>
  );
}

function Spotlight({ items }: { items: Product[] }) {
  const [index, setIndex] = useState(0);
  const product = items[index];
  if (!product) return null;
  return (
    <section className="spotlight">
      <div className="feature-copy">
        <div className="eyebrow">
          <span className="signal" /> Object spotlight
        </div>
        <h1>{product.name}</h1>
        <p>{product.description.split(". ")[0]}.</p>
        <a className="primary" href={link("object", product.id)}>
          View object <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="plate">
        <span className="plate-id">FIG. {product.id}</span>
        <img key={product.id} src={product.image} alt={product.name} />
        <span className="plate-caption">
          {product.category} / FI-{product.id}
        </span>
      </div>
      <div className="carousel">
        <button
          title="Previous spotlight"
          onClick={() => setIndex((index + items.length - 1) % items.length)}
        >
          <ChevronLeft size={16} />
        </button>
        <span>
          {pad(index + 1)} / {pad(items.length)}
        </span>
        <button
          title="Next spotlight"
          onClick={() => setIndex((index + 1) % items.length)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}

function Tiles({
  title,
  items,
  label,
}: {
  title: string;
  items: Product[];
  label: string;
}) {
  return (
    <section className="results">
      <div className="section-title">
        <div>
          <div className="eyebrow">
            <span className="dash" />
            {label}
          </div>
          <h2>{title}</h2>
        </div>
        <span className="count">{pad(items.length)} objects</span>
      </div>
      {items.length ? (
        <div className="grid">
          {items.map((product) => (
            <a
              className="tile"
              key={product.id}
              href={link("object", product.id)}
            >
              <div className="photo">
                <span className="ref">FI-{product.id}</span>
                <img src={product.image} alt={product.name} />
                <span className="rating">
                  <Star size={11} fill="currentColor" />
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <div className="meta">
                {product.category}
                <span>{money(product.price)}</span>
              </div>
              <h3>
                {product.name}
                <ArrowUpRight size={17} />
              </h3>
            </a>
          ))}
        </div>
      ) : (
        <p>
          No objects match. <a href="/?view=all">Browse the catalogue</a>
        </p>
      )}
    </section>
  );
}

function Browse({ catalogue }: { catalogue: Catalogue }) {
  const category = params.get("category") || "";
  const search = params.get("q") || "";
  const home = !category && !params.has("q") && !params.has("view");
  const { featured, additional, matches } = selectProducts(
    catalogue,
    category,
    search,
  );
  const icons = [Armchair, Layers3, Coffee];
  const categories = [
    ...new Set(catalogue.products.map((product) => product.category)),
  ];
  return (
    <>
      {home && <Spotlight items={featured} />}
      <nav aria-label="Browse categories" className="categories">
        <span className="eyebrow">Browse by</span>
        <a className={!category ? "selected" : ""} href="/?view=all">
          <Grid2X2 size={15} />
          All objects
        </a>
        {categories.map((name, index) => {
          const Icon = icons[index] || CircleDot;
          return (
            <a
              key={name}
              className={category === name ? "selected" : ""}
              href={link("category", name)}
            >
              <Icon size={16} />
              {name}
            </a>
          );
        })}
      </nav>
      {home || category ? (
        <>
          <Tiles
            title={category ? `${category}: top rated` : "Top rated objects"}
            label="The curated edit"
            items={featured}
          />
          {category && (
            <Tiles
              title="More in this category"
              label={category}
              items={additional}
            />
          )}
        </>
      ) : (
        <Tiles
          title={search ? `Results for “${search}”` : "All objects"}
          label="Catalogue"
          items={matches}
        />
      )}
    </>
  );
}

function Detail({ product }: { product: Product }) {
  const [state, setState] = useState<"closed" | "open" | "sending" | "sent">(
    "closed",
  );
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    setState("sending");
    setError("");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, productId: product.id }),
      });
      if (!response.ok) throw Error((await response.json()).error);
      setState("sent");
    } catch (reason) {
      setError(
        reason instanceof TypeError
          ? "Connection lost. Please try again."
          : reason instanceof Error
            ? reason.message
            : "Please try again.",
      );
      setState("open");
    }
  }
  return (
    <>
      <a className="back" href={link("category", product.category)}>
        <ArrowLeft size={15} /> {product.category}
      </a>
      <article className="detail">
        <div className="detail-photo">
          <span className="ref">FIG. {product.id}</span>
          <img src={product.image} alt={product.name} />
        </div>
        <div>
          <div className="eyebrow">
            <span className="signal" />
            {product.category} / FI-{product.id}
          </div>
          <h1>{product.name}</h1>
          <div className="detail-price">
            {money(product.price)}{" "}
            <span>
              <Star size={13} /> {product.rating.toFixed(1)}
            </span>
          </div>
          <p>{product.description}</p>
          {state === "closed" ? (
            <button className="primary" onClick={() => setState("open")}>
              Enquire <ArrowUpRight size={16} />
            </button>
          ) : state === "sent" ? (
            <p className="thanks" role="status">
              <Check size={18} />
              Thank you. Your enquiry has been sent to sales.
            </p>
          ) : (
            <form className="enquiry" onSubmit={submit}>
              <h2>Product enquiry</h2>
              <label>
                Name
                <input
                  name="name"
                  autoFocus
                  autoComplete="name"
                  maxLength={100}
                  required
                />
              </label>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  required
                />
              </label>
              <label>
                Message (optional)
                <textarea name="message" maxLength={2000} rows={3} />
              </label>
              {error && <p role="alert">{error}</p>}
              <button disabled={state === "sending"} className="primary">
                {state === "sending" ? "Sending..." : "Send enquiry"}
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </article>
    </>
  );
}

function App() {
  const [catalogue, setCatalogue] = useState<Catalogue>();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    fetch("/api/catalogue")
      .then((response) => {
        if (!response.ok) throw Error();
        return response.json();
      })
      .then(setCatalogue)
      .catch(() => setFailed(true));
  }, []);
  const id = params.get("object");
  const product = catalogue?.products.find((item) => item.id === id);
  return (
    <>
      <Header />
      <main className="wrap">
        <div className="folio">
          <span>
            <span className="square" /> Object catalogue
          </span>
          <span>
            Form Index <b>/</b> Vol. 01
          </span>
        </div>
        {!catalogue ? (
          <p role="status">
            {failed ? (
              <>
                Catalogue unavailable. <a href={location.href}>Try again</a>
              </>
            ) : (
              "Loading catalogue..."
            )}
          </p>
        ) : id ? (
          product ? (
            <Detail product={product} />
          ) : (
            <p>
              Object not found. <a href="/">Return home</a>
            </p>
          )
        ) : (
          <Browse catalogue={catalogue} />
        )}
      </main>
      <footer className="wrap">
        <Brand />
        <span>Object catalogue &nbsp; / &nbsp; Vol. 01</span>
      </footer>
    </>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
