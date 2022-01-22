import React, { createContext, useState, useEffect } from 'react';
import DrawerContainer from './DrawerContainer';

export const CartContext = createContext(null);

function Layout({ children }) {
    const [cartOpen, setCartOpen] = useState(false);
    const handleOpen = () => setCartOpen(!cartOpen);

    return (
        <CartContext.Provider value={{ cartOpen, setCartOpen }}>
            <div className="drawer drawer-end">
                <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content min-h-screen">
                    <main>{children}</main>
                </div>
                <DrawerContainer cartOpen={cartOpen} handleOpen={handleOpen} />
            </div>
        </CartContext.Provider>
    )
}

export default Layout
