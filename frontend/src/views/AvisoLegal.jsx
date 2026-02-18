import { Link } from "react-router-dom";
import { useEffect } from "react";


const CATEGORIES = [
    { id: 1, name: "Pods Descartables", slug: "vapes-desechables" },
    { id: 2, name: "Pods Recargables", slug: "pods-recargables" },
    { id: 3, name: "Líquidos", slug: "liquidos" },
    { id: 4, name: "Resistencias", slug: "resistencias" },
    { id: 6, name: "Perfumes", slug: "perfumes" },
];

export default function AvisoLegal() {

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-10">
            {/* CONTENIDO PRINCIPAL */}
            <div className="md:col-span-2">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Aviso legal y política de privacidad</h1>

                <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-5">
                    <p>
                        En <strong>Zarpados</strong> respetamos la privacidad y la protección de los datos personales de nuestros usuarios.
                        Este documento tiene como finalidad informar de manera clara y transparente cómo se recopila, utiliza y protege la información
                        proporcionada a través de este sitio web.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-2 text-gray-800">1. Identificación del titular</h2>
                    <p>
                        El presente sitio web pertenece a <strong>Mauricio Fiuri</strong>, titular de <strong>Zarpados</strong>,
                        con domicilio en Argentina y correo electrónico de contacto:{" "}
                        <strong>zarpado.vap@gmail.com</strong>.
                        Actualmente, Zarpados opera como un emprendimiento individual sin personería jurídica constituida.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-2 text-gray-800">2. Protección de datos personales</h2>
                    <p>
                        En cumplimiento de la <strong>Ley N° 25.326 de Protección de Datos Personales</strong> (República Argentina),
                        los datos proporcionados por los usuarios serán tratados con <strong>estricta confidencialidad</strong>
                        y utilizados únicamente para los fines legítimos relacionados con la gestión comercial, atención al cliente,
                        y envío de información sobre nuestros productos o promociones.
                    </p>
                    <p>
                        En ningún caso los datos personales serán cedidos, vendidos o compartidos con terceros, salvo obligación legal
                        o requerimiento de una autoridad competente.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-2 text-gray-800">3. Derechos del usuario</h2>
                    <p>
                        El usuario podrá ejercer en cualquier momento sus derechos de{" "}
                        <strong>acceso, rectificación, actualización o eliminación</strong> de sus datos personales,
                        enviando una solicitud al correo electrónico: <strong>zarpado.vap@gmail.com</strong>.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-2 text-gray-800">4. Envío de comunicaciones</h2>
                    <p>
                        El usuario acepta recibir comunicaciones electrónicas relacionadas con su compra o con información relevante
                        de Zarpados. Si no desea recibir más mensajes, podrá darse de baja en cualquier momento
                        desde los propios correos o enviando una solicitud a <strong>zarpado.vap@gmail.com</strong>.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-2 text-gray-800">5. Responsabilidad sobre el uso del sitio</h2>
                    <p>
                        Zarpados no se hace responsable por el uso indebido de los contenidos publicados ni por daños derivados
                        del acceso o interpretación incorrecta de la información disponible en el sitio.
                        Todo el contenido, diseño, imágenes y estructura del sitio web son propiedad de Zarpados
                        y no podrán ser reproducidos sin autorización previa y por escrito.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-2 text-gray-800">6. Modificaciones</h2>
                    <p>
                        Zarpados se reserva el derecho de actualizar o modificar, en cualquier momento y sin previo aviso,
                        la presente política de privacidad y las condiciones de uso del sitio, con el objetivo de mantenerlas
                        actualizadas conforme a la legislación vigente y a las mejoras del servicio.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-2 text-gray-800">7. Legislación aplicable</h2>
                    <p>
                        Este sitio web, así como las relaciones entre Zarpados y los usuarios,
                        se rigen por las leyes de la <strong>República Argentina</strong> y están sujetas
                        a la jurisdicción de los tribunales competentes del país.
                    </p>

                    <p className="text-sm text-gray-500 italic mt-6">
                        Última actualización: {new Date().toLocaleDateString("es-AR", { year: "numeric", month: "long" })}.
                    </p>
                </div>
            </div>

            {/* CATEGORÍAS LATERALES */}
            <aside className="bg-white border rounded-lg p-5 shadow-sm h-fit">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Categorías</h2>
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
