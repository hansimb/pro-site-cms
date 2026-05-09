"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Link } from "@chakra-ui/react";
import { ContactModal } from "./contact-modal";

type ContactModalContextValue = {
  email?: string;
  linkedinUrl?: string;
  openModal: () => void;
};

const ContactModalContext = createContext<ContactModalContextValue | null>(
  null,
);

type ContactModalProviderProps = {
  children: ReactNode;
  email?: string;
  linkedinUrl?: string;
};

export function ContactModalProvider({
  children,
  email,
  linkedinUrl,
}: ContactModalProviderProps) {
  const [open, setOpen] = useState(false);
  const hasActions = Boolean(email || linkedinUrl);

  const value = useMemo<ContactModalContextValue>(
    () => ({
      email,
      linkedinUrl,
      openModal: () => {
        if (hasActions) {
          setOpen(true);
        }
      },
    }),
    [email, hasActions, linkedinUrl],
  );

  return (
    <ContactModalContext.Provider value={value}>
      {children}
      <ContactModal
        email={email}
        linkedinUrl={linkedinUrl}
        onClose={() => setOpen(false)}
        open={open}
      />
    </ContactModalContext.Provider>
  );
}

type ContactModalTriggerProps = {
  alignSelf?: string;
  color?: string;
  fontSize?: string | Record<string, string>;
  label?: string;
};

export function ContactModalTrigger({
  alignSelf,
  color = "muted",
  fontSize = "sm",
  label = "Contact",
}: ContactModalTriggerProps) {
  const context = useContext(ContactModalContext);

  if (!context || (!context.email && !context.linkedinUrl)) {
    return null;
  }

  return (
    <Link
      as="button"
      alignSelf={alignSelf}
      color={color}
      fontSize={fontSize}
      onClick={context.openModal}
      textDecoration="none"
      transition="color 160ms ease"
      _hover={{ color: "accent" }}
    >
      {label}
    </Link>
  );
}
