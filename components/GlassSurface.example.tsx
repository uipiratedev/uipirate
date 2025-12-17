/**
 * GlassSurface Component - Usage Examples
 * From reactbits.dev - Advanced glassmorphism with SVG displacement mapping
 *
 * This component creates premium glass effects with chromatic aberration
 * and advanced distortion effects using SVG filters.
 */

import GlassSurface from "./GlassSurface";

export default function GlassSurfaceExamples() {
  return (
    <div className="container mx-auto p-12 space-y-12 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">
        GlassSurface Component Examples
      </h1>

      {/* Basic Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Usage</h2>
        <p className="text-gray-600">
          Simple glass surface with default settings
        </p>
        <div className="flex flex-wrap gap-4 items-center p-8">
          <GlassSurface width={300} height={200} borderRadius={24}>
            <h2 className="text-xl font-bold">Glass Surface Content</h2>
          </GlassSurface>
        </div>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          {`<GlassSurface 
  width={300} 
  height={200}
  borderRadius={24}
>
  <h2>Glass Surface Content</h2>
</GlassSurface>`}
        </pre>
      </section>

      {/* Custom Displacement Effects */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Advanced Displacement Effects
        </h2>
        <p className="text-gray-600">
          Chromatic aberration and distortion effects
        </p>
        <div className="flex flex-wrap gap-4 items-center p-8">
          <GlassSurface
            width={300}
            height={150}
            borderRadius={20}
            displace={15}
            distortionScale={-150}
            redOffset={5}
            greenOffset={15}
            blueOffset={25}
            brightness={60}
            opacity={0.8}
            mixBlendMode="screen"
          >
            <span className="text-lg font-semibold">
              Advanced Glass Distortion
            </span>
          </GlassSurface>
        </div>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          {`<GlassSurface
  displace={15}
  distortionScale={-150}
  redOffset={5}
  greenOffset={15}
  blueOffset={25}
  brightness={60}
  opacity={0.8}
  mixBlendMode="screen"
>
  <span>Advanced Glass Distortion</span>
</GlassSurface>`}
        </pre>
      </section>

      {/* Responsive Glass Surface */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Responsive Glass Surface</h2>
        <p className="text-gray-600">
          Using percentage widths for responsive layouts
        </p>
        <div className="flex flex-wrap gap-4 items-center p-8">
          <GlassSurface
            width="100%"
            height={120}
            borderRadius={16}
            backgroundOpacity={0.2}
            saturation={1.5}
          >
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Responsive Glass</h3>
              <p className="text-sm">Adapts to container width</p>
            </div>
          </GlassSurface>
        </div>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          {`<GlassSurface
  width="100%"
  height={120}
  borderRadius={16}
  backgroundOpacity={0.2}
  saturation={1.5}
>
  <div>Responsive Glass</div>
</GlassSurface>`}
        </pre>
      </section>

      {/* Props Reference */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Props Reference</h2>
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-lg">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-2 pr-4">Prop</th>
                <th className="pb-2 pr-4">Type</th>
                <th className="pb-2 pr-4">Default</th>
                <th className="pb-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono">width</td>
                <td className="py-2 pr-4">number | string</td>
                <td className="py-2 pr-4">200</td>
                <td className="py-2">Width in pixels or CSS value</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono">height</td>
                <td className="py-2 pr-4">number | string</td>
                <td className="py-2 pr-4">80</td>
                <td className="py-2">Height in pixels or CSS value</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono">borderRadius</td>
                <td className="py-2 pr-4">number</td>
                <td className="py-2 pr-4">20</td>
                <td className="py-2">Border radius in pixels</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono">blur</td>
                <td className="py-2 pr-4">number</td>
                <td className="py-2 pr-4">11</td>
                <td className="py-2">Blur intensity</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-mono">displace</td>
                <td className="py-2 pr-4">number</td>
                <td className="py-2 pr-4">0</td>
                <td className="py-2">Displacement amount for distortion</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

