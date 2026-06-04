"use client";

import { useState } from "react";
import VersionHistoryModal from "./VersionHistoryModal";
import VersionHistoryPanel from "./VersionHistoryPanel";

interface VersionHistoryButtonProps {
  postId: string;
  variant?: "default" | "icon" | "panel";
  className?: string;
}

export default function VersionHistoryButton({
  postId,
  variant = "default",
  className = "",
}: VersionHistoryButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRestore = (version: number) => {
    console.log(`Restored to version ${version}`);
    // Modal will reload the page
  };

  // Panel variant - renders inline without modal
  if (variant === "panel") {
    return <VersionHistoryPanel postId={postId} onRestore={handleRestore} />;
  }

  if (variant === "icon") {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all ${className}`}
          title="View version history"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </button>

        <VersionHistoryModal
          postId={postId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onRestore={handleRestore}
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`px-3 py-2 text-sm font-semibold font-geist text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 flex items-center gap-2 ${className}`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        <span>History</span>
      </button>

      <VersionHistoryModal
        postId={postId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRestore={handleRestore}
      />
    </>
  );
}
