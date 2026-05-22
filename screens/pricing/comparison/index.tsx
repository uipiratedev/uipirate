"use client";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/react";
import GlassBadge from "@/components/GlassBadge";
import { CheckIcon } from "@/components/icons";

const COMPARISON_DATA = [
  { label: "Monthly Cost", uipirate: "$2,000", agency: "$8-15k", freelancer: "$3-5k", inhouse: "$8-12k" },
  { label: "Turnaround", uipirate: "48-72hr", agency: "1-2 weeks", freelancer: "Variable", inhouse: "Slow" },
  { label: "Quality", uipirate: "Enterprise", agency: "Enterprise", freelancer: "Variable", inhouse: "Variable" },
  { label: "Scalability", uipirate: true, agency: true, freelancer: false, inhouse: false },
  { label: "No Contracts", uipirate: true, agency: false, freelancer: true, inhouse: false },
  { label: "Pause Anytime", uipirate: true, agency: false, freelancer: false, inhouse: false },
];

const PricingComparison = () => {
  return (
    <motion.div
      id="compare"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="py-12 max-md:py-8"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <GlassBadge variant="gradient">COMPARE</GlassBadge>
        </div>
        <h2 className="heading-center">
          How We Stack Up
        </h2>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          See why 50+ companies chose us over traditional agencies, freelancers, or hiring in-house.
        </p>
      </div>

      {/* Comparison Table */}
      <Card className="rounded-[20px] max-md:rounded-[12px] border border-gray-200 shadow-sm overflow-hidden">
        <CardBody className="p-0">
          {/* Table Header */}
          <div className="grid grid-cols-5 max-md:grid-cols-3 bg-gray-50 border-b border-gray-200">
            <div className="p-4 max-md:p-3 font-semibold text-gray-500 text-sm"></div>
            <div className="p-4 max-md:p-3 text-center bg-brand-orange/5 border-x border-brand-orange/20">
              <span className="font-bold text-brand-orange">UI Pirate</span>
            </div>
            <div className="p-4 max-md:p-3 text-center max-md:hidden">
              <span className="font-semibold text-gray-600">US Agency</span>
            </div>
            <div className="p-4 max-md:p-3 text-center max-md:hidden">
              <span className="font-semibold text-gray-600">Freelancer</span>
            </div>
            <div className="p-4 max-md:p-3 text-center">
              <span className="font-semibold text-gray-600">In-House</span>
            </div>
          </div>

          {/* Table Rows */}
          {COMPARISON_DATA.map((row, index) => (
            <div
              key={row.label}
              className={`grid grid-cols-5 max-md:grid-cols-3 ${index !== COMPARISON_DATA.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="p-4 max-md:p-3 font-medium text-gray-700 text-sm flex items-center">
                {row.label}
              </div>
              <div className="p-4 max-md:p-3 text-center bg-brand-orange/5 border-x border-brand-orange/10 flex items-center justify-center">
                {typeof row.uipirate === 'boolean' ? (
                  row.uipirate ? (
                    <span className="text-green-500"><CheckIcon /></span>
                  ) : (
                    <span className="text-gray-300">✕</span>
                  )
                ) : (
                  <span className="font-semibold text-gray-900">{row.uipirate}</span>
                )}
              </div>
              <div className="p-4 max-md:p-3 text-center max-md:hidden flex items-center justify-center">
                {typeof row.agency === 'boolean' ? (
                  row.agency ? <span className="text-green-500"><CheckIcon /></span> : <span className="text-gray-300">✕</span>
                ) : (
                  <span className="text-gray-600">{row.agency}</span>
                )}
              </div>
              <div className="p-4 max-md:p-3 text-center max-md:hidden flex items-center justify-center">
                {typeof row.freelancer === 'boolean' ? (
                  row.freelancer ? <span className="text-green-500"><CheckIcon /></span> : <span className="text-gray-300">✕</span>
                ) : (
                  <span className="text-gray-600">{row.freelancer}</span>
                )}
              </div>
              <div className="p-4 max-md:p-3 text-center flex items-center justify-center">
                {typeof row.inhouse === 'boolean' ? (
                  row.inhouse ? <span className="text-green-500"><CheckIcon /></span> : <span className="text-gray-300">✕</span>
                ) : (
                  <span className="text-gray-600">{row.inhouse}</span>
                )}
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default PricingComparison;
