import { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Context } from "../js/store/appContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";


const API = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") || "";

// --- helpers ---
const normalizeImagePath = (u = "") => {
  if (!u) return "";
  if (u.startsWith("/admin/uploads/")) u = u.replace("/admin", "/public");
  if (u.startsWith("/uploads/")) u = `/public${u}`;
  return u;
};

const toAbsUrl = (u = "") => {
  u = normalizeImagePath(u);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("/public/")) return `${API}${u}`;
  if (u.startsWith("/")) return u;
  return `${API}/${u}`;
};

const getTitle = (it) => {
  let base = String(it?.name ?? it?.product?.name ?? it?.title ?? "Producto");
  if (it.selectedFlavor) base += ` (${it.selectedFlavor})`;
  return base;
};

export default function Cart({ isOpen: controlledOpen, onClose: controlledOnClose }) {
  const { store, actions } = useContext(Context);
  const [showCheckout, setShowCheckout] = useState(false);

  const [customerData, setCustomerData] = useState(() => {
    const saved = localStorage.getItem("customerData");
    return saved
      ? JSON.parse(saved)
      : { name: "", zone: "", payment: "" };
  });

  const navigate = useNavigate();
  const location = useLocation();
  const isWholesale = location.pathname.startsWith("/mayorista");


  const isRouteMode = controlledOpen === undefined && controlledOnClose === undefined;
  const [internalOpen, setInternalOpen] = useState(true);
  const isOpen = isRouteMode ? internalOpen : !!controlledOpen;

  const close = () => {
    if (isRouteMode) {
      setInternalOpen(false);
      setTimeout(() => navigate(-1), 180);
    } else if (controlledOnClose) {
      controlledOnClose();
    }
  };

  // devuelve precio correcto según modo
  const getItemPrice = (item) => {
    if (isWholesale) {
      if (Number(item.price_wholesale) > 0) return Number(item.price_wholesale);
      return null; // mayorista sin precio → consultar
    }
    return Number(item.price) || 0;
  };



  // ===============================
  // MENSAJE WHATSAPP
  // ===============================
  // ===============================
  // TOTAL DEL CARRITO (VISIBLE EN UI)
  // ===============================

  const total = (store.cart || []).reduce((sum, item) => {
    const price = getItemPrice(item);
    if (price === null) return sum; // si es "consultar" no suma
    return sum + price * (Number(item.quantity) || 0);
  }, 0);


  const buildWhatsAppMessage = () => {
    if (!store.cart || store.cart.length === 0) return "";

    const isWholesale = window.location.pathname.startsWith("/mayorista");

    let message = "Hola! Quiero hacer el siguiente pedido:\n\n";

    let total = 0;
    let hasUnknownPrice = false;

    store.cart.forEach((item) => {
      const name = item.name;
      const flavor = item.selectedFlavor ? ` (${item.selectedFlavor})` : "";
      const qty = Number(item.quantity) || 0;

      const wholesalePrice = Number(item.price_wholesale);
      const retailPrice = Number(item.price);

      const price = isWholesale
        ? (wholesalePrice > 0 ? wholesalePrice : null)
        : retailPrice;

      message += `• ${qty} x ${name}${flavor}\n`;

      if (price !== null) {
        const subtotal = price * qty;
        total += subtotal;

        message += `   $${price.toLocaleString("es-AR")} c/u\n`;
        message += `   Subtotal: $${subtotal.toLocaleString("es-AR")}\n\n`;
      } else {
        hasUnknownPrice = true;
        message += `   Precio: Consultar\n\n`;
      }
    });

    if (hasUnknownPrice) {
      message += "TOTAL: Consultar\n\n";
    } else {
      message += `TOTAL: $${total.toLocaleString("es-AR")}\n\n`;
    }

    // 🚚 info de envío (PRO y simple)
    message += "🚚 Envío: a coordinar con el vendedor\n\n";

    message += "Gracias!";


    return message; // ⚠️ IMPORTANTE: SIN encode
  };


  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };

  const selectPayment = (method) => {
    setCustomerData(prev => ({ ...prev, payment: method }));
  };


  const sendOrder = async () => {

    if (!customerData.name || !customerData.zone || !customerData.payment) {
      alert("Por favor completá tus datos");
      return;
    }

    localStorage.setItem("customerData", JSON.stringify(customerData));

    const phone = "5493534793366";

    const orderText = buildWhatsAppMessage();

    const extraData = `

Datos del cliente:

Nombre: ${customerData.name}
Localidad / Zona: ${customerData.zone}
Pago: ${customerData.payment}

`;

    const finalMessage = orderText.replace(
      "Gracias!",
      `${extraData}Gracias!`
    );

    // 🔹 Construir items del pedido
    const isWholesale = window.location.pathname.startsWith("/mayorista");

    const orderItems = store.cart.map(item => ({
      product_id: item.id,   // 👈 obligatorio
      quantity: item.quantity,
      price: isWholesale
        ? (item.price_wholesale > 0 ? item.price_wholesale : 0)
        : item.price,
      selected_flavor: item.selectedFlavor || null
    }));


    // 🔹 calcular total
    const totalAmount = orderItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    // 🔹 enviar pedido al backend
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/public/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customer_first_name: customerData.name,
          customer_last_name: "",
          customer_phone: "",
          shipping_address: {
            city: customerData.zone,
            label: customerData.zone
          },
          payment_method: customerData.payment,
          order_items: orderItems,
          total_amount: totalAmount,
          status: "pendiente"
        })
      });
    } catch (err) {
      console.error("Error guardando pedido:", err);
    }

    // ✅ encode SOLO AQUÍ
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(finalMessage)}`;

    window.open(url, "_blank");

    setShowCheckout(false);
  };



  // ===============================
  // ABRIR WHATSAPP
  // ===============================

  const sendToWhatsApp = () => {
    const phone = "5493534793366"; // ⚠️ CAMBIAR POR EL NÚMERO DEL CLIENTE
    const text = buildWhatsAppMessage();

    const url = `https://wa.me/${phone}?text=${text}`;

    window.open(url, "_blank");
  };


  const [postalCode, setPostalCode] = useState("");
  const [pickup, setPickup] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && isOpen && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const closeBtnRef = useRef(null);
  useEffect(() => {
    if (isOpen && closeBtnRef.current) closeBtnRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    // 🚨 Solo una vez al montar el componente
    if (window.location.pathname.includes("thank-you")) {
      actions.resetCartAfterPayment?.();
    }

    // Si el carrito está vacío, asegúrate de reflejarlo en localStorage
    if (Array.isArray(store.cart) && store.cart.length === 0) {
      localStorage.setItem("cart", JSON.stringify([]));
    }
  }, []); // 👈 Solo se ejecuta una vez al montar




  if (!controlledOpen && !isRouteMode && controlledOpen !== false) return null;

  const DrawerContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-start justify-between p-4 sm:p-5 border-b">
        <h2 id="cart-title" className="text-xl sm:text-2xl font-bold">
          Carrito de compras
        </h2>
        <button
          ref={closeBtnRef}
          onClick={close}
          aria-label="Cerrar carrito"
          className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
        {!store.cart || store.cart.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <p className="text-base sm:text-lg">Tu carrito está vacío</p>
            <button
              onClick={() => (isRouteMode ? navigate("/") : close())}
              className="mt-4 w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Ver más productos
            </button>
          </div>
        ) : (
          <>
            {store.cart.map((item) => {
              const max = (item?.selectedFlavor && Array.isArray(item?.flavor_catalog))
                ? (item.flavor_catalog.find(f => f?.name === item.selectedFlavor)?.stock ?? (Number.isFinite(Number(item?.stock)) ? Number(item.stock) : 0))
                : (Number.isFinite(Number(item?.stock)) ? Number(item.stock) : 0);

              const atLimit = Number(item.quantity || 0) >= Number(max || 0);

              return (
                <div key={`${item.id}-${item.selectedFlavor || 'default'}`} className="bg-white border rounded-lg p-3 sm:p-4 shadow-sm">
                  <div className="flex gap-3">
                    <img
                      src={toAbsUrl(item?.image_url) || "/sin_imagen.jpg"}
                      alt={getTitle(item)}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { e.currentTarget.src = "/sin_imagen.jpg"; }}
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-medium text-sm sm:text-base leading-snug">
                            {getTitle(item)}
                          </h4>
                          <p className="text-gray-900 font-semibold">
                            {getItemPrice(item) !== null
                              ? `$${getItemPrice(item).toLocaleString("es-AR")}`
                              : "Consultar"}
                          </p>

                        </div>
                        <button
                          onClick={() => actions.removeFromCart(item.id, item.selectedFlavor)}
                          className="text-gray-400 hover:text-gray-600"
                          aria-label="Eliminar producto"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>

                      {/* Controles de cantidad */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              actions.updateCartQuantity(
                                item.id,
                                Math.max(1, (item.quantity || 1) - 1),
                                item.selectedFlavor
                              )
                            }
                            aria-label="Disminuir cantidad"
                            className="w-9 h-9 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg"
                          >
                            -
                          </button>
                          <span className="min-w-[36px] text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              const next = Math.min((item.quantity || 1) + 1, Number(max || 0));
                              actions.updateCartQuantity(item.id, next, item.selectedFlavor);
                            }}
                            aria-label="Aumentar cantidad"
                            disabled={atLimit}
                            title={atLimit ? "Sin stock disponible" : "Aumentar cantidad"}
                            className={`w-9 h-9 rounded flex items-center justify-center text-lg ${atLimit ? "bg-gray-100 opacity-50 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200"}`}
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right font-semibold">
                          {getItemPrice(item) !== null
                            ? `$${(getItemPrice(item) * Number(item.quantity || 0)).toLocaleString("es-AR")}`
                            : "Consultar"}
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Subtotal */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-gray-700">
            Subtotal <span className="text-sm text-gray-400">(sin envío)</span> :
          </span>
          <span className="font-semibold">
            ${total.toLocaleString("es-AR")}
          </span>
        </div>




        {/* Nuestro local */}
        <div>
          <h3 className="font-semibold mb-2">Retiro en nuestro local</h3>
          <label className="flex items-start gap-3 bg-white border rounded-lg p-3 sm:p-4 shadow-sm">
            <input
              type="checkbox"
              checked={pickup}
              className="mt-1 size-4 cart-checkbox"
              onChange={(e) => {
                setPickup(e.target.checked);
                actions.setPickup(e.target.checked);
              }}
            />


            <div className="flex-1">
              <p className="text-sm sm:text-base">
                Local Zarpados - Velez Sarsfield 303
                <span className="block text-gray-500">
                  Lunes a viernes 10:30hs a 13:00hs | 16:00hs a 22:00hs
                  <br />
                  Sábado 13:00hs a 22:00hs | Domingo cerrado
                </span>
              </p>
            </div>
            <span className="text-green-600 font-semibold">Gratis</span>
          </label>
        </div>
      </div>

      {/* Footer Totales / Acciones */}
      {store.cart && store.cart.length > 0 && (
        <div className="border-t p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-semibold">Total:</span>
            <span className="text-2xl font-bold text-purple-600">
              ${total.toLocaleString("es-AR")}
            </span>
          </div>

          <button
            onClick={() => setShowCheckout(true)}

            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Pedir por WhatsApp
          </button>


          <div className="mt-4 text-center">
            {isRouteMode ? (
              <Link to="/" className="text-gray-700 underline hover:text-gray-900">
                Ver más productos
              </Link>
            ) : (
              <button onClick={close} className="text-gray-700 underline hover:text-gray-900">
                Ver más productos
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (isRouteMode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-lg mx-auto">{DrawerContent}</div>
      </div>
    );
  }

  const modalUI = (
    <div className={`fixed inset-0 z-[100] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ease-out ${isOpen ? "opacity-100" : "opacity-0"
          }`}
        onClick={close}
      />
      <aside
        className={`
          absolute right-0 top-0
          h-screen w-full max-w-md md:max-w-lg
          bg-white shadow-2xl
          transform transition-transform duration-500 ease-out
          ${controlledOpen ? "translate-x-0" : "translate-x-full"}
          flex flex-col text-gray-900
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        {DrawerContent}
      </aside>
    </div>
  );



  return createPortal(
    <>
      {modalUI}

      {showCheckout && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200]">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">
              Datos para el pedido
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              Guardamos tus datos para futuras compras.
            </p>

            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={customerData.name}
              onChange={handleCustomerChange}
              className="w-full border rounded px-3 py-2 mb-3"
            />

            <input
              type="text"
              name="zone"
              placeholder="Zona / Localidad"
              value={customerData.zone}
              onChange={handleCustomerChange}
              className="w-full border rounded px-3 py-2 mb-4"
            />

            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Forma de pago</p>

              <div className="space-y-2 text-sm">
                {["Transferencia", "Efectivo", "Coordinar"].map(method => {
                  const selected = customerData.payment === method;

                  return (
                    <label
                      key={method}
                      className={`flex items-center gap-3 cursor-pointer border rounded-md px-3 py-2 transition
      ${selected
                          ? "bg-green-500 text-white border-green-600 shadow-sm"
                          : "bg-white hover:bg-gray-50 border-gray-300"}
      `}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={selected}
                        onChange={() => selectPayment(method)}
                        className="accent-green-600"
                      />
                      {method}
                    </label>
                  );
                })}

              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2 mb-4 text-center">
              📦 Envío disponible <br />
              <span className="italic">El costo se coordina con el vendedor.</span>
            </p>


            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCheckout(false)}
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>

              <button
                onClick={sendOrder}
                className="px-4 py-2 bg-purple-600 text-white rounded"
              >
                Enviar pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );

}
