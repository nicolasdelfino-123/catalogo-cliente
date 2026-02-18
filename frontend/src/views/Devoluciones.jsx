// src/pages/Devoluciones.jsx
import { Link } from "react-router-dom";
import { useEffect } from "react";

const CATEGORIES = [
    { id: 1, name: "Pods Descartables", slug: "vapes-desechables" },
    { id: 2, name: "Pods Recargables", slug: "pods-recargables" },
    { id: 3, name: "Líquidos", slug: "liquidos" },
    { id: 4, name: "Resistencias", slug: "resistencias" },
    { id: 6, name: "Perfumes", slug: "perfumes" },
];

export default function Devoluciones() {

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-10">
            {/* CONTENIDO PRINCIPAL */}
            <div className="md:col-span-2">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    Cambios y devoluciones
                </h1>

                <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-5">
                    <p>
                        En <strong>Zarpados</strong> trabajamos únicamente con
                        productos originales y de excelente calidad. Por motivos de higiene
                        y seguridad, los artículos de vapeo no tienen cambio ni devolución
                        una vez entregados.
                    </p>

                    <p>
                        Tanto los dispositivos desechables como los recargables se
                        consideran productos de uso personal y no cuentan con garantía de
                        funcionamiento.
                    </p>

                    <p>
                        Te recomendamos revisar cuidadosamente tu pedido antes de confirmar
                        la compra y asegurarte de haber seleccionado el producto correcto.
                        Ante cualquier duda o inconveniente, nuestro equipo de atención
                        estará disponible para asesorarte y brindarte toda la información
                        que necesites.
                    </p>

                    <p className="text-sm text-gray-500 italic">
                        Gracias por confiar en nosotros. Buscamos que cada experiencia de
                        compra sea transparente, clara y satisfactoria.
                    </p>
                </div>
            </div>

            {/* CATEGORÍAS LATERALES */}
            <aside className="bg-white border rounded-lg p-5 shadow-sm h-fit">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Categorías
                </h2>
                <ul className="space-y-3">
                    {CATEGORIES.map((cat) => (
                        <li key={cat.id}>
                            <Link
                                to={`/categoria/${cat.slug}`}
                                className="block px-3 py-2 rounded-md hover:bg-purple-50 hover:text-purple-700 transition-colors text-gray-700"
                            >
                                {cat.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    );
}
