"use client";

export default function BookCall() {
  return (
    <div className="flex justify-center items-center min-h-screen  p-4">
      <iframe
        src="https://cal.com/ui-pirate/zerorisk"
        width="100%"
        height="780"
        frameBorder="0"
        allow="camera; microphone; autoplay; encrypted-media;"
        className="rounded-2xl w-full"
      ></iframe>
    </div>
  );
}
