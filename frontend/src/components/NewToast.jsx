import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const toastRoot = document.getElementById("toast-root") || (() => {
    const el = document.createElement("div");
    el.id = "toast-root";
    document.body.appendChild(el);
    return el;
})();

export default function NewToast({ toast, onClose }) {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState(toast);

    useEffect(() => {
        if (toast?.isVisible) {

            setData(toast);
            setVisible(true);

            const timer = setTimeout(() => {

                setVisible(false);
                onClose?.();
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            setVisible(false);
        }
    }, [toast]);

    if (!visible) return null;

    const toastElement = (
        <div
            className="fixed top-[2cm] right-5 z-[999999] pointer-events-auto animate-slide-in transition-all duration-300 ease-out"
            style={{ fontFamily: "system-ui" }}
        >
            <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center space-x-3 max-w-sm">
                {/* Imagen */}
                {data?.product?.image && (
                    <img
                        src={data.product.image}
                        alt={data.product.name || "Producto"}
                        className="w-12 h-12 rounded-md object-cover border border-white/20"
                    />
                )}

                {/* Texto */}
                <div className="flex flex-col flex-1">
                    <span className="font-semibold">{data?.message}</span>
                    {data?.product && (
                        <>
                            <span className="text-sm">{data.product.name}</span>
                            <span className="text-sm font-medium">
                                {data.product.price !== null && data.product.price !== undefined
                                    ? `$${data.product.price.toLocaleString("es-AR")}`
                                    : "Consultar"}
                            </span>

                        </>
                    )}
                </div>

                {/* Botón cerrar */}
                <button
                    onClick={() => {

                        setVisible(false);
                        onClose?.();
                    }}
                    className="flex-shrink-0 p-1 rounded-full hover:bg-green-600 transition-colors duration-200 focus:outline-none"
                    aria-label="Cerrar notificación"
                >
                    <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );

    return ReactDOM.createPortal(toastElement, toastRoot);
}
