import { Cloud, Brain, Award, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const featureIcons = {
  awsPartnership: Cloud,
  aiExpertise: Brain,
  certification: Award,
  location: Building,
} as const;

export function Features() {
  const { t } = useLanguage();

  const features = [
    {
      key: 'awsPartnership' as const,
      icon: featureIcons.awsPartnership,
    },
    {
      key: 'aiExpertise' as const,
      icon: featureIcons.aiExpertise,
    },
    {
      key: 'certification' as const,
      icon: featureIcons.certification,
    },
    {
      key: 'location' as const,
      icon: featureIcons.location,
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {t.features.title}
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed mt-4">
            {t.features.subtitle}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.key} className="border-2">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle>{t.features.items[feature.key].title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">{t.features.items[feature.key].description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}