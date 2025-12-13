import {createContext, useState, useEffect } from "react";

export const UIContext = createContext();

export function UIProvider({ children }) {
    const [pageTitle, setPageTitle] = useState("None");

    return (
        <UIContext.Provider value={{ pageTitle, setPageTitle }}>
            {children}
        </UIContext.Provider>
    );
}