"use client";

export default function BookCall() {
  return (
    <div className="flex justify-center items-center min-h-screen  p-4">
      <iframe
        allow="camera; microphone; autoplay; encrypted-media;"
        className="rounded-2xl w-full"
        frameBorder="0"
        height="780"
        src="https://cal.com/ui-pirate/15min"
        title="Book a Call with UI Pirate"
        width="100%"
      />
    </div>
  );
}
