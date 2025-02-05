import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiLinkedin } from "react-icons/si";
import { useState } from "react";

export default function About() {
  const [imageError, setImageError] = useState(false);

  return (
    <main className="min-h-screen py-24">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-purple-100 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <img 
                src="/images/eugene-profile.png" 
                alt="Eugene Xolani Nxumalo" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  console.error('Image failed to load');
                  setImageError(true);
                }}
                style={{ display: imageError ? 'none' : 'block' }}
              />
              {imageError && (
                <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary/70">
                  EXN
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold mb-4">Eugene Xolani Nxumalo</h1>
              <p className="text-xl text-gray-600 mb-4">Founder & Chairman</p>
              <a 
                href="https://uk.linkedin.com/in/eugene-x-nxumalo" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2 hover:bg-primary/5">
                  <SiLinkedin className="w-5 h-5" />
                  Connect on LinkedIn
                </Button>
              </a>
            </div>
          </div>

          <Card className="border-none shadow-sm">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-8 text-primary/90">Our Vision</h2>
              <p className="text-lg leading-relaxed text-gray-600 mb-6">
                South Africa possesses an extraordinary pool of young talent - bright minds eager to excel in the technology sector. Despite this abundance of talent, our youth face significant unemployment challenges. At the same time, Western nations including the UK, USA, Canada, Australia, and Western Europe face a growing demand for qualified technology professionals, with numerous job opportunities available.
              </p>
              <p className="text-lg leading-relaxed text-gray-600 mb-6">
                Through my extensive experience in talent development and recruitment, I've witnessed firsthand how South African youth, when equipped with the right qualifications and training, can excel in the global technology marketplace. This understanding led to the establishment of NXU Academy.
              </p>
              <p className="text-lg leading-relaxed text-gray-600">
                Our mission is clear: to transform South Africa's abundant youth talent into globally certified professionals in Machine Learning, AI, and Cloud Computing. By providing internationally recognized qualifications and AWS certifications, we're not just educating students - we're creating a pipeline of skilled professionals ready to seize opportunities in the world's leading technology markets.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}