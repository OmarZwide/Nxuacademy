import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Calendar } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const timelineYears = [1994, 2004, 2015, 2020, 2025] as const;
type TimelineYear = typeof timelineYears[number];

export function Timeline() {
  const { t } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<TimelineYear>(2025);

  return (
    <section className="py-24 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {t.timeline.title}
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed mt-4">
            {t.timeline.subtitle}
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-purple-200" />

          {/* Timeline Events */}
          <div className="grid gap-8">
            {timelineYears.map((year, index) => (
              <motion.div
                key={year}
                className={`flex items-center ${
                  index % 2 === 0 ? "justify-end" : "justify-start"
                } relative`}
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? "pr-8" : "pl-8"}`}>
                  <Card
                    className={`cursor-pointer transition-all ${
                      selectedYear === year
                        ? "border-purple-400 shadow-lg"
                        : "hover:border-purple-200"
                    }`}
                    onClick={() => setSelectedYear(year)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span className="font-bold">{year}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {t.timeline.culturalContext[year]}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Timeline Node */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full ${
                    selectedYear === year
                      ? "bg-purple-600"
                      : "bg-purple-200"
                  }`}
                />
              </motion.div>
            ))}
          </div>

          {/* Selected Event Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedYear}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-12"
            >
              <Card className="border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ChevronRight className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-lg">
                      Cultural Context
                    </h3>
                  </div>
                  <p className="text-gray-600">{t.timeline.culturalContext[selectedYear]}</p>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}