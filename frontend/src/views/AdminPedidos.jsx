import { useEffect, useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") || "";

export default function AdminPedidos() {
    const [orders, setOrders] = useState([]);
    const [selected, setSelected] = useState(null); // 🆕 Pedido seleccionado
    const [loadingId, setLoadingId] = useState(null);

    const token =
        localStorage.getItem("token") || localStorage.getItem("admin_token");

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API}/admin/orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            // ✅ No tocamos los datos, el backend ya manda public_order_number correcto
            setOrders(data || []);
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };


    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id, status, tracking_code = "") => {
        try {
            const res = await fetch(`${API}/admin/orders/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status, tracking_code }),
            });
            if (!res.ok) throw new Error("No se pudo actualizar el estado");
            await fetchOrders();
            alert("Estado actualizado y email enviado al cliente");
        } catch (err) {
            console.error(err);
            alert("Error actualizando estado");
        }
    };


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Pedidos recibidos</h1>

            {orders.length === 0 && (
                <p className="text-gray-500 text-center mt-10">No hay pedidos aún.</p>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-2 text-left">#</th>
                            <th className="p-2 text-left">Cliente</th>
                            {/*            <th className="p-2 text-left">Email</th> */}
                            <th className="p-2 text-left">Total</th>
                            <th className="p-2 text-left">Estado</th>
                            <th className="p-2 text-left">Fecha</th>
                            <th className="p-2 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((o) => (
                            <tr key={o.id} className="border-t hover:bg-gray-50">
                                <td className="p-2 font-semibold text-gray-700">
                                    #{o.public_order_number || o.id}

                                </td>



                                <td className="p-2">{o.customer_first_name} {o.customer_last_name}</td>
                                {/*     <td className="p-2">{o.customer_email}</td> */}
                                <td className="p-2">${o.total_amount?.toLocaleString() || 0}</td>
                                <td className="p-2">
                                    <span
                                        className={`px-2 py-1 rounded text-xs ${o.status === "enviado"
                                            ? "bg-green-100 text-green-800"
                                            : o.payment_method === "transferencia"
                                                ? "bg-orange-100 text-orange-800"
                                                : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {o.status || "pendiente"}
                                    </span>

                                </td>
                                <td className="p-2">
                                    {new Date(o.created_at).toLocaleString("es-AR")}
                                </td>
                                <td className="p-2 flex gap-2 justify-center">
                                    <button
                                        onClick={() => setSelected(o)}
                                        className="px-3 py-1 border rounded hover:bg-gray-100"
                                    >
                                        Ver detalle
                                    </button>
                                    {/* {o.status !== "enviado" && (
                                        <button
                                            onClick={() => updateStatus(o.id, "enviado")}
                                            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                                        >
                                            Marcar enviado
                                        </button>
                                    )} */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 🆕 Modal de detalle */}
            {selected && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            onClick={() => setSelected(null)}
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-semibold mb-3">
                            Pedido #{selected.public_order_number || selected.id}

                            <span className="block text-sm text-gray-500 mt-1">
                                {new Date(selected.created_at).toLocaleString("es-AR")}
                            </span>
                        </h2>




                        <div className="mb-3 space-y-1">
                            <p>
                                <strong>Cliente:</strong> {selected.customer_first_name}{" "}
                                {selected.customer_last_name}
                            </p>
                            {/*   <p>
                                <strong>Email:</strong> {selected.customer_email}
                            </p> */}
                            {selected.customer_phone && (
                                <p>
                                    <strong>Teléfono:</strong> {selected.customer_phone}
                                </p>
                            )}
                            {selected.customer_dni && (
                                <p>
                                    <strong>DNI:</strong> {selected.customer_dni}
                                </p>
                            )}
                            {selected.payment_method && (
                                <p>
                                    <strong>Forma de pago:</strong>{" "}
                                    {{
                                        transferencia: "Transferencia",
                                        efectivo: "Efectivo",
                                        coordinar: "A coordinar",
                                        mercadopago: "Mercado Pago",
                                    }[selected.payment_method] || selected.payment_method}
                                </p>
                            )}


                            {selected.customer_comment && (
                                <p className="mt-2 text-sm text-gray-600">
                                    <strong>Comentario:</strong> {selected.customer_comment}
                                </p>
                            )}
                        </div>

                        <div className="border-t border-b py-3 mb-3 space-y-1">
                            <h3 className="text-lg font-medium mt-3 mb-1">Datos de envío</h3>
                            <p>
                                <strong>Entrega/Retiro:</strong>{" "}
                                {typeof selected.shipping_address === "string"
                                    ? selected.shipping_address
                                    : selected.shipping_address?.label || "No informado"}
                            </p>

                            {typeof selected.shipping_address === "object" && (
                                <>
                                    {selected.shipping_address?.address && (
                                        <p>
                                            <strong>Dirección:</strong> {selected.shipping_address.address}
                                        </p>
                                    )}
                                    {selected.shipping_address?.apartment && (
                                        <p>
                                            <strong>Piso/Depto:</strong> {selected.shipping_address.apartment}
                                        </p>
                                    )}
                                    {selected.shipping_address?.city && (
                                        <p>
                                            <strong>Ciudad:</strong> {selected.shipping_address.city}
                                        </p>
                                    )}
                                    {selected.shipping_address?.province && (
                                        <p>
                                            <strong>Provincia:</strong> {selected.shipping_address.province}
                                        </p>
                                    )}
                                    {selected.shipping_address?.country && (
                                        <p>
                                            <strong>País:</strong> {selected.shipping_address.country}
                                        </p>
                                    )}
                                    {(selected.shipping_address?.postalCode || selected.shipping_address?.zip_code) && (
                                        <p>
                                            <strong>Código Postal:</strong>{" "}
                                            {selected.shipping_address?.postalCode || selected.shipping_address?.zip_code}
                                        </p>
                                    )}


                                    {(selected.shipping_address?.phone || selected?.billing_address?.phone) && (
                                        <p>
                                            <strong>Teléfono:</strong>{" "}
                                            {selected.shipping_address?.phone || selected?.billing_address?.phone}
                                        </p>
                                    )}



                                    {selected.shipping_address?.cost !== undefined && (
                                        <p>
                                            <strong>Costo de envío:</strong>{" "}
                                            {selected.shipping_address.cost === 0
                                                ? "Gratis"
                                                : `$${selected.shipping_address.cost.toLocaleString()}`}
                                        </p>
                                    )}
                                </>
                            )}

                            <p>
                                <strong>Estado del pedido:</strong>{" "}
                                <span
                                    className={`px-2 py-1 rounded text-xs ${selected.status === "enviado"
                                        ? "bg-green-100 text-green-800"
                                        : selected.payment_method === "transferencia"
                                            ? "bg-orange-100 text-orange-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }`}
                                >
                                    {selected.status || "pendiente"}
                                </span>
                            </p>

                        </div>


                        {/* Productos */}
                        <h3 className="text-lg font-medium mb-2">Productos</h3>
                        <div className="border rounded">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-2 text-left">Producto</th>
                                        <th className="p-2 text-center">Cant.</th>
                                        <th className="p-2 text-right">Precio</th>
                                        <th className="p-2 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {(selected.order_items || selected.items || []).map((i, idx) => (

                                        <tr key={idx} className="border-t">
                                            <td className="p-2">
                                                <span className="font-medium">
                                                    {i.product_name || i.title || "Producto sin nombre"}
                                                </span>
                                                {i.selected_flavor && (
                                                    <span className="block text-xs text-gray-500">
                                                        Sabor: {i.selected_flavor}
                                                    </span>
                                                )}
                                            </td>

                                            <td className="p-2 text-center">{i.quantity}</td>
                                            <td className="p-2 text-right">
                                                ${i.price?.toLocaleString() || 0}
                                            </td>
                                            <td className="p-2 text-right">
                                                ${(i.quantity * i.price).toLocaleString() || 0}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t font-semibold">
                                        <td colSpan="3" className="p-2 text-right">
                                            Total
                                        </td>
                                        <td className="p-2 text-right">
                                            ${selected.total_amount?.toLocaleString() || 0}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* <div className="mt-4 flex items-center justify-between">
                            <input
                                type="text"
                                placeholder="Código de envío (opcional)"
                                value={selected.tracking_code || ""}
                                onChange={(e) =>
                                    setSelected({ ...selected, tracking_code: e.target.value })
                                }
                                className="border rounded px-3 py-2 text-sm w-1/2"
                            />
                            {selected.status !== "enviado" && (
                                <button
                                    onClick={async () => {
                                        setLoadingId(selected.id);
                                        await updateStatus(selected.id, "enviado", selected.tracking_code);
                                        setLoadingId(null);
                                    }}
                                    disabled={loadingId === selected.id}
                                    className={`px-3 py-1 rounded text-white ${loadingId === selected.id
                                        ? "bg-purple-400 cursor-not-allowed"
                                        : "bg-purple-600 hover:bg-purple-700"
                                        }`}
                                >
                                    {loadingId === selected.id ? (
                                        <span className="flex items-center gap-2">
                                            <svg
                                                className="animate-spin h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                ></path>
                                            </svg>
                                            Enviando...
                                        </span>
                                    ) : (
                                        "Marcar enviado"
                                    )}
                                </button>


                            )}
                        </div>
 */}
                    </div>
                </div>
            )}
        </div>
    );
}
