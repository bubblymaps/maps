import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-4 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} Linus Kang. Bubbly Maps is under CC BY-NC 4.0.
    </footer>
  );
}
