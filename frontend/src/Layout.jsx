import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext, { Context } from "./js/store/appContext.jsx";

// Vistas existentes
import Home from "./views/Home";
import Register from "./views/Register.jsx";
import Login from "./views/Login.jsx";
import SetupPassword from "./views/SetupPassword.jsx";
import ResetPassword from "./views/ResetPassword.jsx";
import Logout from "./views/Logout.jsx";
import Inicio from "./views/Inicio.jsx";

import ProductDetail from "./views/ProductDetail.jsx";
import Footer from "./components/Footer.jsx";

// Componentes existentes
import Cart from "./components/Cart.jsx";
import ProductGrid from "./components/ProductGrid.jsx";
import Header from "./components/Header.jsx";
import NewToast from "./components/NewToast.jsx";
import AdminProducts from "./views/AdminProducts.jsx";
import Checkout from "./components/Checkout.jsx";
import CheckoutSuccess from "./views/CheckoutSuccess.jsx";
import CheckoutFailure from "./views/CheckoutFailure.jsx";
import CheckoutPending from "./views/CheckoutPending.jsx";

// Páginas de "Mi Cuenta"
import AccountLayout from "./views/AccountLayout.jsx";
import Dashboard from "./views/Dashboard.jsx";
import OrderListPage from "./views/OrderListPage.jsx";
import OrderDetailPage from "./views/OrderDetailPage.jsx";
import AddressesPage from "./views/AddressesPage.jsx";
import AccountDetailsPage from "./views/AccountDetailsPage.jsx";
import LoginAdmin from "./views/LoginAdmin.jsx";
import FloatingButtons from "./components/FloatingButtons.jsx";
import Mayorista from "./views/Mayorista.jsx";
import ThankYou from "./views/ThankYou.jsx";
import AdminPedidos from "./views/AdminPedidos.jsx";
import Devoluciones from "./views/Devoluciones.jsx";
import Envios from "./views/Envios.jsx";
import AvisoLegal from "./views/AvisoLegal.jsx";
import ThankYouTransfer from "./components/ThankYouTransfer.jsx";

// 🔥 NUEVO: Spinner + imágenes de Inicio
import Spinner from "./components/Spinner.jsx";
import heroBg from '@/assets/hero-bg.png';
import banner1 from '@/assets/banner-1.png';
import recargables from '@/assets/recargables.png';
import celu from '@/assets/celu.png';
import desechables from '@/assets/desechables.png';
import perfumes from '@/assets/perfumes.png';
import accesorios from '@/assets/accesorios.png';
import liquidos from '@/assets/liquidos.png';


// 🔥 Componente helper para Inicio con fade suave
const InicioWithSpinner = ({ images }) => {
  const [showPage, setShowPage] = useState(false);

  return (
    <>
      <Spinner
        images={images}
        minDelay={800}
        onLoadComplete={() => setShowPage(true)}
      />
      <div
        className={showPage ? 'opacity-100' : 'opacity-0'}
        style={{
          transition: 'opacity 3s ease-in-out',
          willChange: 'opacity'
        }}
      >
        <Inicio />
      </div>
    </>
  );
};

const Layout = () => {
  const { store, actions } = useContext(Context);




  // 🔥 Array de imágenes pesadas para el Spinner
  const inicioImages = [heroBg, banner1, recargables, celu, desechables, perfumes, accesorios, liquidos];

  useEffect(() => {
    const initializeApp = async () => {
      const skipHydrate = window.location.pathname.includes("thank-you");

      if (!skipHydrate) {
        actions.hydrateCart?.();
        // Pequeño delay opcional por compatibilidad visual
        setTimeout(() => { }, 100);
      }

      if (actions.hydrateSession) {
        await actions.hydrateSession();
      }

      if (actions.fetchCategoriesFromAPI) {
        await actions.fetchCategoriesFromAPI();
      }

      if (actions.fetchProducts && (!store.products || store.products.length === 0)) {
        await actions.fetchProducts();
      }
    };

    initializeApp();
  }, []);


  return (
    <div>
      <BrowserRouter>
        <FloatingButtons />
        <Header />

        <Routes>
          {/* 🔥 MODIFICADO: Agregamos fade suave */}
          <Route exact path="/" element={<InicioWithSpinner images={inicioImages} />} />
          <Route path="/inicio" element={<InicioWithSpinner images={inicioImages} />} />

          {/* Resto sin cambios */}
          <Route path="/login" element={<Login />} />
          <Route path="/setup-password" element={<SetupPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductGrid />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/failure" element={<CheckoutFailure />} />
          <Route path="/checkout/pending" element={<CheckoutPending />} />
          <Route path="/categoria/:slug" element={<ProductGrid />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/mayorista" element={<Mayorista />} />
          <Route path="/admin/pedidos" element={<AdminPedidos />} />
          <Route path="/devoluciones" element={<Devoluciones />} />
          <Route path="/envios" element={<Envios />} />
          <Route path="/aviso-legal" element={<AvisoLegal />} />
          <Route path="/thank-you-transfer" element={<ThankYouTransfer />} />


          <Route path="/pago/exitoso" element={<ThankYou />} />
          <Route path="/pago/fallido" element={<ThankYou />} />
          <Route path="/pago/pendiente" element={<ThankYou />} />
          <Route path="/thank-you" element={<ThankYou />} />

          <Route path="/cuenta" element={<AccountLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="pedidos" element={<OrderListPage />} />
            <Route path="pedidos/:orderId" element={<OrderDetailPage />} />
            <Route path="direcciones" element={<AddressesPage />} />
            <Route path="detalles" element={<AccountDetailsPage />} />
            <Route path="cerrar" element={<Logout />} />
          </Route>

        </Routes>
        <Footer />



      </BrowserRouter>
      <NewToast toast={store.toast} onClose={() => actions.hideToast()} />

    </div>
  );
};

export default injectContext(Layout);