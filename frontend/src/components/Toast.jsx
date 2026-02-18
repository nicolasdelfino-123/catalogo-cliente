import { useEffect, useState } from 'react'

export default function Toast({
    message,
    isVisible,
    onClose,
    duration = 3000,
    product
}) {
    const [visible, setVisible] = useState(isVisible)
    const [data, setData] = useState({ message, product })

    useEffect(() => {
        const handler = (e) => {
            console.log("🧭 [TOAST] Evento flux-toast-update detectado:", e.detail)
            setVisible(true)
            setData(e.detail)
        }
        document.addEventListener("flux-toast-update", handler)
        return () => document.removeEventListener("flux-toast-update", handler)
    }, [])

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                console.log("⏳ [TOAST] Cierre automático tras", duration, "ms")
                setVisible(false)
                onClose()
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [visible, duration, onClose])

    if (!visible) return null

    return (
        <div className="fixed top-4 right-4 z-[99999] pointer-events-auto animate-slide-in transition-opacity duration-500 ease-in-out">
            <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm sm:max-w-md">
                {data.product?.image && (
                    <img
                        src={data.product.image}
                        alt={data.product.name || 'Producto'}
                        className="w-12 h-12 rounded-md object-cover border border-white/20"
                    />
                )}

                <div className="flex flex-col flex-1">
                    <span className="font-semibold">{data.message}</span>
                    {data.product && (
                        <>
                            <span className="text-sm">{data.product.name}</span>
                            <span className="text-sm font-medium">
                                ${data.product.price?.toLocaleString('es-AR')}
                            </span>
                        </>
                    )}
                </div>

                {/* ✅ Wrapper aislado del text-white del padre */}
                <div className="isolate">
                    <button
                        onClick={() => {
                            console.log("❌ [TOAST] Cierre manual");
                            setVisible(false);
                            onClose();
                        }}
                        className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                        style={{
                            backgroundColor: '#dc2626', // 🔥 Rojo inicial
                            color: '#dc2626',           // 🔥 Color del currentColor para el SVG
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')} // hover verde
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')} // vuelve a rojo
                        aria-label="Cerrar notificación"
                    >
                        <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="#fff" // Cruz blanca
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                        >
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                </div>
            </div>
        </div>
    )
}
