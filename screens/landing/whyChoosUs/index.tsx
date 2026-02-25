import GlassBadge from "@/components/GlassBadge";
import { SaaS } from "@/components/icons";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";

const WhyChooseUs = () => {
  return (
    <section className="w-full py-32 min-h-screen">
      <div className="container mx-auto px-4 mb-20">
         <div className="mb-6 flex flex-row items-center justify-center">
          <GlassBadge variant="gradient">WHY CHOOSE US</GlassBadge>
        </div>
        <h2 className="heading-center mb-6">
        Why SaaS & AI Teams <span className="text-brand-orange">Choose UI Pirate</span>?
        </h2>
       
      </div>

      <div className="w-full">
        <ScrollStack useWindowScroll={true}>
          <ScrollStackItem itemClassName="bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700 text-white">
            <div className="flex flex-row justify-between h-full">
            <div className="flex flex-col justify-center h-full w-[60%]">
             
              <h3 className="text-3xl font-bold mb-4">Simplifying SaaS Complexity</h3>
              <p className="text-lg opacity-90">
               We understand data-heavy workflows, permissions, onboarding, multi-roles, and enterprise behaviour patterns.
              </p>
             <p>1</p>
            </div>
            <div >
              <SaaS />
               </div>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <div className="flex flex-col justify-center h-full">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-3xl font-bold mb-4">Lightning-Fast Performance</h3>
              <p className="text-lg opacity-90">
                Speed matters. We optimize every aspect of your UI for blazing-fast load times
                and smooth interactions that keep users engaged.
              </p>
              <ul className="mt-6 space-y-2 text-base opacity-90">
                <li>✓ Optimized code & assets</li>
                <li>✓ 90+ Lighthouse scores</li>
                <li>✓ Smooth animations</li>
              </ul>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="bg-gradient-to-br from-green-500 to-teal-600 text-white">
            <div className="flex flex-col justify-center h-full">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-3xl font-bold mb-4">Conversion-Focused UX</h3>
              <p className="text-lg opacity-90">
                Beautiful design that drives results. We craft user experiences that guide visitors
                toward action, turning browsers into customers.
              </p>
              <ul className="mt-6 space-y-2 text-base opacity-90">
                <li>✓ User-centered design</li>
                <li>✓ Clear call-to-actions</li>
                <li>✓ Proven conversion patterns</li>
              </ul>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="bg-gradient-to-br from-pink-500 to-rose-600 text-white">
            <div className="flex flex-col justify-center h-full">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-3xl font-bold mb-4">Fully Responsive Design</h3>
              <p className="text-lg opacity-90">
                Your users are everywhere. We ensure your interface looks perfect and functions
                flawlessly on every device, from mobile to desktop.
              </p>
              <ul className="mt-6 space-y-2 text-base opacity-90">
                <li>✓ Mobile-first approach</li>
                <li>✓ Cross-browser compatible</li>
                <li>✓ Adaptive layouts</li>
              </ul>
            </div>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="bg-gradient-to-br from-indigo-500 to-blue-700 text-white">
            <div className="flex flex-col justify-center h-full">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-3xl font-bold mb-4">Strategic Approach</h3>
              <p className="text-lg opacity-90">
                We don't just make things pretty. Every design decision is backed by research,
                data, and a deep understanding of your business goals.
              </p>
              <ul className="mt-6 space-y-2 text-base opacity-90">
                <li>✓ Data-driven decisions</li>
                <li>✓ User research & testing</li>
                <li>✓ Business goal alignment</li>
              </ul>
            </div>
          </ScrollStackItem>
        </ScrollStack>
      </div>
    </section>
  );
};

export default WhyChooseUs;
