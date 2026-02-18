import React from 'react'
import { Link } from 'react-router-dom'

const phone = "5493533497041";
const message = encodeURIComponent(`Hola, tengo una consulta sobre el producto...`);
const link = `https://wa.me/${phone}?text=${message}`;


// En tu Footer.jsx — mini mapa label/slug para no volverte loco
const FOOTER_CATEGORIES = [
    { label: "Vapes Descartables", slug: "vapes-desechables" }, // en CATEGORIES es "Pods Descartables"
    { label: "Pods Recargables", slug: "pods-recargables" },
    { label: "Líquidos", slug: "liquidos" },
    { label: "Accesorios", slug: "resistencias" },      // si usás "resistencias" como accesorios
    { label: "Perfumes", slug: "perfumes" },
];

const Footer = () => {
    return (
        <div>
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Zarpados AR</h3>
                            <p className="text-gray-400">La mejor tienda de vapeadores en Argentina</p>
                        </div>



                        {/* 🟢 Productos */}
                        <div>
                            <h4 className="font-semibold mb-4">Productos</h4>
                            <ul className="space-y-2 text-gray-400">
                                {FOOTER_CATEGORIES.map((c) => (
                                    <li key={c.slug}>
                                        <Link
                                            to={`/categoria/${c.slug}`}
                                            state={{ fromFooter: true }}     // 👈 Marca que viene desde el footer
                                            className="hover:text-white transition-colors"
                                        >
                                            {c.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Ayuda</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <Link
                                        to="/aviso-legal"
                                        className="hover:text-white transition-colors"
                                    >
                                        Aviso Legal
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/envios" className="hover:text-white transition-colors">
                                        Envíos
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/devoluciones" className="hover:text-white transition-colors">
                                        Devoluciones
                                    </Link>
                                </li>

                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Contacto</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-white transition-colors"
                                    >
                                        WhatsApp: +54 9 3533 49-7041
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="mailto:zarpado.vap@gmail.com"
                                        className="hover:text-white transition-colors"
                                    >
                                        Email: zarpado.vap@gmail.com
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.instagram.com/zarpados.vap/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-white transition-colors"
                                    >
                                        Instagram: @zarpados.vap
                                    </a>
                                </li>
                            </ul>
                        </div>

                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
                        <p>
                            Copyright © 2025 | Zarpados — Sitio web desarrollado por{" "}
                            <a
                                href="https://wa.me/5493534793366?text=Hola%2C%20vi%20tu%20web%20y%20quiero%20consultarte%20por%20una%20página"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white transition-colors font-medium"
                            >
                                Nicolás Delfino
                            </a>.
                        </p>
                    </div>

                </div>
            </footer>
        </div>
    )
}

export default Footer
