// src/pages/Envios.jsx
import { Link } from "react-router-dom";
import { useEffect } from "react";

const CATEGORIES = [
    { id: 1, name: "Pods Descartables", slug: "vapes-desechables" },
    { id: 2, name: "Pods Recargables", slug: "pods-recargables" },
    { id: 3, name: "Líquidos", slug: "liquidos" },
    { id: 4, name: "Resistencias", slug: "resistencias" },
    { id: 6, name: "Perfumes", slug: "perfumes" },
];

export default function Envios() {

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-10">
            {/* CONTENIDO PRINCIPAL */}
            <div className="md:col-span-2">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    Política de envíos
                </h1>

                <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-5">
                    <p>
                        En <strong>Zarpados</strong> realizamos envíos a todo el país
                        a través de <strong>Correo</strong>, garantizando rapidez y
                        seguridad en cada entrega. El tiempo estimado de despacho es de{" "}
                        <strong>2 a 5 días hábiles</strong>, dependiendo de la ubicación del
                        destino.
                    </p>

                    <p>
                        También ofrecemos la opción de{" "}
                        <strong>retiro en nuestro local</strong>. Una vez confirmada tu
                        compra, podrás retirar tu pedido únicamente dentro de los días y
                        horarios de atención publicados.
                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-lg">
                        <p className="text-gray-700">
                            <strong>📦 Importante:</strong>
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-2 text-gray-700">
                            <li>
                                Una vez despachado el paquete, la responsabilidad pasa a manos
                                del correo. No nos hacemos responsables por demoras o daños
                                ocurridos durante el traslado.
                            </li>
                            <li>
                                Es fundamental realizar el seguimiento del envío utilizando el{" "}
                                <strong>número de tracking</strong> que recibirás por correo
                                electrónico una vez despachada la orden.
                            </li>
                            <li>
                                En caso de extravío o inconveniente con el envío, podrás
                                comunicarte directamente con el servicio de atención del
                                <strong> Correo</strong> para gestionar el reclamo.
                            </li>
                        </ul>
                    </div>

                    <p className="text-sm text-gray-500 italic">
                        Nos comprometemos a despachar tu pedido en el menor tiempo posible,
                        cuidando cada detalle para que tu experiencia sea confiable y
                        segura.
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
