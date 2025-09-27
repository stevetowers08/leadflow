import { useState, useEffect } from "react";
import { LinkedInConfirmationModal } from "./LinkedInConfirmationModal";

interface AutomationModalManagerProps {
  selectedLeads: any[];
  jobTitle?: string;
  companyName?: string;
}

export function AutomationModalManager({ selectedLeads, jobTitle, companyName }: AutomationModalManagerProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (selectedLeads.length > 0) {
      console.log("🚀 AutomationModalManager: Opening modal with leads:", selectedLeads.length);
      setShowModal(true);
    }
  }, [selectedLeads]);

  const handleClose = () => {
    console.log("🚀 AutomationModalManager: Closing modal");
    setShowModal(false);
  };

  const handleConfirm = () => {
    console.log("🚀 AutomationModalManager: Confirming automation");
    setShowModal(false);
  };

  return (
    <LinkedInConfirmationModal
      selectedLeads={selectedLeads}
      isOpen={showModal}
      onClose={handleClose}
      onConfirm={handleConfirm}
      jobTitle={jobTitle}
      companyName={companyName}
    />
  );
}











