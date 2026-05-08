"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}

export function Modal({
  children,
  onClose,
  title = "Detalles de la receta",
}: ModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] p-0">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <ScrollArea className="h-[85vh] rounded-md">
          <div className="p-6">{children}</div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
