function safeProductId(p) {
  if (p == null || typeof p !== "object") return null;
  const id = p.product_id ?? p.id;
  return id != null ? String(id) : null;
}

function safeProductDisplay(p) {
  if (p == null || typeof p !== "object") return { id: "unknown", name: "", description: "", category: "", price: 0, image_url: null, reasoning: null, risk_signal: null };
  return {
    id: safeProductId(p) ?? "unknown",
    name: p.name != null ? String(p.name) : "",
    description: p.description != null ? String(p.description) : "",
    category: p.category != null ? String(p.category) : "",
    price: Number(p.price) || 0,
    image_url: p.image_url != null && p.image_url !== "" ? String(p.image_url) : null,
    reasoning: p.reasoning != null ? String(p.reasoning) : null,
    risk_signal: p.risk_signal != null ? String(p.risk_signal) : null,
  };
}

export function ProductCards({ products }) {
  const list = Array.isArray(products) ? products : [];
  if (list.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {list.map((p, index) => {
        const safe = safeProductDisplay(p);
        const key = safe.id !== "unknown" ? safe.id : `product-${index}`;
        return (
          <article
            key={key}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-square bg-slate-100 relative overflow-hidden">
              {safe.image_url ? (
                <img
                  src={safe.image_url}
                  alt={safe.name || "Product"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    try {
                      const img = e && e.target;
                      if (img && typeof img.style !== "undefined") img.style.display = "none";
                      const fallback = img && img.nextElementSibling;
                      if (fallback && typeof fallback.style !== "undefined") fallback.style.display = "flex";
                    } catch (_) {}
                  }}
                />
              ) : null}
              <div
                className="w-full h-full flex items-center justify-center text-slate-400 text-4xl font-display"
                style={safe.image_url ? { display: "none" } : {}}
              >
                E
              </div>
              <span className="absolute top-2 left-2 bg-evocative-primary/90 text-white text-xs font-medium px-2 py-0.5 rounded">
                {safe.category || "Product"}
              </span>
            </div>
            <div className="p-3">
              <h4 className="font-display font-semibold text-slate-800 text-sm line-clamp-2">
                {safe.name || "Unnamed product"}
              </h4>
              <p className="text-evocative-primary font-semibold mt-1">
                ${safe.price.toFixed(2)}
              </p>
              {safe.reasoning ? (
                <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                  {safe.reasoning}
                </p>
              ) : null}
              {safe.risk_signal ? (
                <p className="text-xs text-amber-700 mt-1">{safe.risk_signal}</p>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
