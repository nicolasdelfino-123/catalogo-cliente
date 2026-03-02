import React, { useContext, useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { Context } from "../js/store/appContext.jsx";
import ProductCardPerfumes from "../components/ui/cards/ProductCardPerfumes.jsx";
import HomeContact from "../components/home/HomeContact.jsx";
import banner from "../assets/banner_arabe.jpg";

export default function InicioNuevo() {
    const { store, actions } = useContext(Context);
    const location = useLocation();

    useEffect(() => {
        if (actions?.fetchProducts) {
            actions.fetchProducts();
        }
    }, []);

    const ADDRESS = "Vélez Sarsfield 303, Las Varillas, Córdoba";
    const HOURS = "Lunes a Sábado 8:00–12:00 / 17:00–20:15";
    const IG_URL = "https://www.instagram.com/zarpados.vap/";
    const WA_URL = `https://wa.me/5493533497041?text=${encodeURIComponent(
        "Hola, quiero consultar por un perfume del catálogo"
    )}`;

    const MAP_EMBED =
        "https://www.google.com/maps?q=-31.8704952,-62.7228966&z=17&hl=es&output=embed";


    useLayoutEffect(() => {
        const lastId = sessionStorage.getItem("lastProductId");
        if (!lastId) return;

        const el = document.querySelector(`[data-product-id="${lastId}"]`);
        if (!el) return;

        el.scrollIntoView({ block: "center" });

        // opcional: limpiar para que no te re-scrollee en futuras entradas
        sessionStorage.removeItem("lastProductId");
    }, []);
    return (
        <div className="min-h-screen bg-gray-50">


            {/* HERO PREMIUM CON IMAGEN IMPORTADA */}
            <section className="relative h-[75vh] min-h-[450px] flex items-center justify-center text-center overflow-hidden">

                {/* Fondo con tu imagen */}
                <div
                    className="absolute inset-0 bg-center bg-cover animate-zoomSlow"
                    style={{ backgroundImage: `url(${banner})` }}
                />

                {/* Overlay oscuro elegante */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

                {/* Contenido */}
                <div className="relative z-10 px-6 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-wide">
                        Perfumes Árabes
                    </h1>

                    <p className="text-lg md:text-xl text-gray-200 mb-6">
                        Fragancias intensas • Elegancia oriental • Exclusividad
                    </p>

                    <a
                        href={WA_URL}
                        className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
                    >
                        Consultar por WhatsApp
                    </a>
                </div>

            </section>

            {/* PRODUCTOS */}
            <section className="max-w-7xl mx-auto px-2 sm:px-4 py-12">
                <h2 className="text-2xl font-bold text-center mb-8">
                    Productos destacados
                </h2>

                {store.loading ? (
                    <p className="text-center">Cargando...</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-0 gap-y-2 md:gap-6">
                        {(store.products || []).slice(0, 12).map((product) => (
                            <div key={product.id} data-product-id={product.id}>
                                <ProductCardPerfumes product={product} returnTo={location.pathname} isGrid={false} />
                            </div>
                        ))}
                    </div>
                )}
            </section>
            <HomeContact
                address={ADDRESS}
                hours={HOURS}
                igUrl={IG_URL}
                waUrl={WA_URL}
                mapEmbed={MAP_EMBED}
            />

        </div>
    );
}