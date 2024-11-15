import React, { createContext, useContext, useState, ReactNode } from "react";

interface AccessibillityContextType {
  isMagnified: boolean;
  toggleMagnify: () => void;
}

const AccessibillityContext = createContext<
  AccessibillityContextType | undefined
>(undefined);

export const AccessibillityProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isMagnified, setIsMagnified] = useState(false);

  const toggleMagnify = () => setIsMagnified((prev) => !prev);

  return (
    <AccessibillityContext.Provider value={{ isMagnified, toggleMagnify }}>
      {children}
    </AccessibillityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibillityContext);
  if (!context)
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  return context;
};
