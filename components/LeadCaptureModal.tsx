"use client";

import { Modal, ModalContent, ModalBody } from "@heroui/react";
import LeadCaptureForm from "./LeadCaptureForm";
import { useEffect } from "react";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
  // Handle body lock and Lenis smooth scroll toggle
  useEffect(() => {
    const lenis = (window as any).__lenis;

    if (isOpen) {
      // 1. Lock native scroll
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');

      // 2. Stop Lenis smooth scroll if active
      if (lenis) {
        lenis.stop();
        console.log("Lenis stopped via modal");
      }
    } else {
      // 1. Restore native scroll
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');

      // 2. Restart Lenis
      if (lenis) {
        lenis.start();
        console.log("Lenis started via modal");
      }
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
      if (lenis) {
        lenis.start();
      }
    };
  }, [isOpen]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      backdrop="blur"
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "rounded-[24px] border-1 border-gray-200 shadow-2xl overflow-hidden max-h-[92vh]",
        backdrop: "bg-black/50 backdrop-blur-md",
        wrapper: "z-[9999999] overflow-hidden",
      }}
    >
      <ModalContent className="rounded-[24px] overflow-hidden" data-lenis-prevent>
        {(onCloseInternal) => (
          <ModalBody className="p-8 max-md:p-6 overflow-y-auto custom-scrollbar rounded-[24px] min-h-[500px]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's Venture Together</h2>
              <p className="text-gray-500">
                Tell us about your project and we'll get back to you within 2 hours.
              </p>
            </div>
            
            <LeadCaptureForm 
              source="footer-cta" 
              onSuccess={() => {
                onCloseInternal();
                onClose();
              }}
            />
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
