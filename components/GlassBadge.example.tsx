/**
 * GlassBadge Component - Usage Examples
 *
 * This file demonstrates all the different ways to use the GlassBadge component.
 * Copy and paste these examples into your components as needed.
 */

import GlassBadge from "./GlassBadge";

export default function GlassBadgeExamples() {
  return (
    <div className="container mx-auto p-12 space-y-12">
      <h1 className="text-4xl font-bold mb-8">GlassBadge Component Examples</h1>

      {/* Gradient Variant (Default) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Gradient Variant (Glass Effect with Colored Dots)
        </h2>
        <p className="text-gray-600">
          Premium glass morphism effect with 3 colored dots in the background
          (#63FFCD, #A4E3FD, #FFC3E0) - perfect for hero sections
        </p>
        <div className="flex flex-wrap gap-4 items-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <GlassBadge>Design & Development</GlassBadge>
          <GlassBadge variant="gradient">Our Services</GlassBadge>
          <GlassBadge size="sm" variant="gradient">
            Small Badge
          </GlassBadge>
          <GlassBadge size="lg" variant="gradient">
            Large Badge
          </GlassBadge>
        </div>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          {`<GlassBadge>Design & Development</GlassBadge>
<GlassBadge variant="gradient" size="sm">Small Badge</GlassBadge>
<GlassBadge variant="gradient" size="lg">Large Badge</GlassBadge>`}
        </pre>
      </section>

      {/* Solid Variant */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Solid Glass Variant</h2>
        <p className="text-gray-600">
          Subtle glass effect with solid background - great for overlays
        </p>
        <div className="flex flex-wrap gap-4 items-center p-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <GlassBadge variant="solid">Featured</GlassBadge>
          <GlassBadge size="sm" variant="solid">
            New
          </GlassBadge>
          <GlassBadge size="lg" variant="solid">
            Premium
          </GlassBadge>
        </div>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          {`<GlassBadge variant="solid">Featured</GlassBadge>
<GlassBadge variant="solid" size="sm">New</GlassBadge>
<GlassBadge variant="solid" size="lg">Premium</GlassBadge>`}
        </pre>
      </section>

      {/* Cyan Variant */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Cyan Variant</h2>
        <p className="text-gray-600">
          Bright cyan background with border - matches existing brand badges
        </p>
        <div className="flex flex-wrap gap-4 items-center p-8 bg-gray-50 rounded-lg">
          <GlassBadge variant="cyan">About Us</GlassBadge>
          <GlassBadge size="sm" variant="cyan">
            Services
          </GlassBadge>
          <GlassBadge size="lg" variant="cyan">
            Testimonials
          </GlassBadge>
        </div>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          {`<GlassBadge variant="cyan">About Us</GlassBadge>
<GlassBadge variant="cyan" size="sm">Services</GlassBadge>
<GlassBadge variant="cyan" size="lg">Testimonials</GlassBadge>`}
        </pre>
      </section>

      {/* Custom Styling */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Custom Styling</h2>
        <p className="text-gray-600">
          Add custom classes for additional styling
        </p>
        <div className="flex flex-wrap gap-4 items-center p-8 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg">
          <GlassBadge className="text-blue-600">Custom Color</GlassBadge>
          <GlassBadge className="shadow-lg" variant="gradient">
            With Shadow
          </GlassBadge>
          <GlassBadge uppercase={false} variant="solid">
            Mixed Case Text
          </GlassBadge>
        </div>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          {`<GlassBadge className="text-blue-600">Custom Color</GlassBadge>
<GlassBadge variant="gradient" className="shadow-lg">With Shadow</GlassBadge>
<GlassBadge variant="solid" uppercase={false}>Mixed Case Text</GlassBadge>`}
        </pre>
      </section>

      {/* Real-world Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Real-world Usage Example</h2>
        <p className="text-gray-600">How to use in a typical section header</p>
        <div className="p-8 bg-white rounded-lg border">
          <div className="flex flex-row items-center justify-center mb-6">
            <GlassBadge variant="gradient">Design & Development</GlassBadge>
          </div>
          <h2 className="text-center text-4xl font-bold mb-4">
            We design world-class products.
            <br />
            <span className="text-orange-500">You launch them.</span>
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            From strategic UX to scalable frontend architecture, we are the
            product team you wish you had in-house.
          </p>
        </div>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          {`<div className="flex flex-row items-center justify-center mb-6">
  <GlassBadge variant="gradient">Design & Development</GlassBadge>
</div>
<h2 className="text-center text-4xl font-bold">
  We design world-class products.
</h2>`}
        </pre>
      </section>

      {/* Props Reference */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Props Reference</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-2 pr-4">Prop</th>
                <th className="pb-2 pr-4">Type</th>
                <th className="pb-2 pr-4">Default</th>
                <th className="pb-2">Description</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono">children</td>
                <td className="py-2 pr-4">ReactNode</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Badge content</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono">variant</td>
                <td className="py-2 pr-4">"gradient" | "solid" | "cyan"</td>
                <td className="py-2 pr-4">"gradient"</td>
                <td className="py-2">Visual style variant</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono">size</td>
                <td className="py-2 pr-4">"sm" | "md" | "lg"</td>
                <td className="py-2 pr-4">"md"</td>
                <td className="py-2">Badge size</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono">uppercase</td>
                <td className="py-2 pr-4">boolean</td>
                <td className="py-2 pr-4">true</td>
                <td className="py-2">Transform text to uppercase</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono">className</td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">""</td>
                <td className="py-2">Additional CSS classes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
