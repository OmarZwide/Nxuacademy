import { Button } from "@/components/ui/button";
import { Gradient } from "@/components/ui/gradient";
import { Link } from "wouter";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Hero() {
  const { t } = useLanguage();

  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[80vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2866&q=80"
          alt="NXU Academy Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="container relative z-10 px-6 py-32">
        <div className="max-w-3xl text-white">
          <div className="mb-8">
            <span className="inline-flex items-center rounded-md bg-purple-400/10 px-3 py-1 text-sm font-medium text-purple-200 ring-1 ring-inset ring-purple-400/20">
              18-Month Programme
            </span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl mb-6">
            M.Sc in Machine Learning, AI and Cloud Computing
          </h1>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            {t.hero.subtitle}
          </p>
          <div className="flex gap-4">
            <Button onClick={scrollToWaitlist} size="lg" className="bg-purple-600 hover:bg-purple-700">
              {t.hero.cta}
            </Button>
            <Link href="/dashboard-preview">
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                {t.hero.preview}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}