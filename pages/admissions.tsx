import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Check, FileCheck, GraduationCap, Calendar, CreditCard, BookOpen, Laptop } from "lucide-react";
import { ZAR } from "../lib/currency";
import { Link } from "wouter";

export default function Admissions() {
  const requirements = [
    {
      title: "Academic Background",
      items: [
        "Bachelor's degree in any field",
        "Minimum of 60% average in your undergraduate degree",
      ],
    },
    {
      title: "Language Proficiency",
      items: [
        "Proficiency in English (written and spoken)",
        "IELTS score of 6.5 or equivalent (for non-native English speakers)",
      ],
    },
    {
      title: "Technical Requirements",
      items: [
        "Personal laptop with minimum specifications for AWS workloads",
        "Reliable internet connection for remote learning components",
        "Webcam and microphone for virtual sessions",
      ],
    },
  ];

  const admissionSteps = [
    {
      title: "Online Application",
      description: "Complete our comprehensive online application form",
      icon: FileCheck,
      details: [
        "Personal information",
        "Academic history",
        "Professional experience",
        "Statement of purpose",
      ],
    },
    {
      title: "Document Submission",
      description: "Upload all required documentation",
      icon: BookOpen,
      details: [
        "Academic transcripts",
        "CV/Resume",
        "Proof of English proficiency",
        "Copy of ID/Passport",
      ],
    },
    {
      title: "Technical Assessment",
      description: "Complete our AWS readiness assessment",
      icon: Laptop,
      details: [
        "Basic programming concepts",
        "Problem-solving skills",
        "Cloud computing fundamentals",
        "Technical aptitude",
      ],
    },
    {
      title: "Interview",
      description: "Virtual interview with our academic team",
      icon: GraduationCap,
      details: [
        "Discussion of goals",
        "Technical background review",
        "Program expectations",
        "Q&A session",
      ],
    },
    {
      title: "Enrollment",
      description: "Secure your place in the program",
      icon: Calendar,
      details: [
        "Accept offer letter",
        "Submit enrollment deposit",
        "Choose payment plan",
        "Complete registration",
      ],
    },
  ];

  const fees = {
    total: 84600,
    deposit: 25380, // 30%
    monthly: 4935, // (Total - Deposit) / 12
  };

  return (
    <main className="min-h-screen py-24">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">
            Join South Africa's Premier AWS Academy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your career with our MSc in Machine Learning, AI and Cloud Computing, 
            featuring official AWS certifications and industry placement.
          </p>
        </div>

        <Tabs defaultValue="requirements" className="max-w-4xl mx-auto mb-16">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="process">Application Process</TabsTrigger>
            <TabsTrigger value="fees">Fees & Funding</TabsTrigger>
          </TabsList>

          <TabsContent value="requirements">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {requirements.map((section, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="process">
            <div className="space-y-6">
              {admissionSteps.map((step, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Step {index + 1}: {step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-2 gap-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fees">
            <Card>
              <CardHeader>
                <CardTitle>Investment in Your Future</CardTitle>
                <CardDescription>
                  Flexible payment options to make your education accessible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-primary/5 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Program Fees</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Total Program Fee</span>
                        <span className="font-semibold">{ZAR.format(fees.total)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Initial Deposit (30%)</span>
                        <span>{ZAR.format(fees.deposit)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Monthly Payments (12 months)</span>
                        <span>{ZAR.format(fees.monthly)}/month</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold mb-2">What's Included</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Full MSc Program</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">AWS Certification Fees</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Learning Materials</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Industry Placement Support</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Funding Options</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-primary" />
                          <span className="text-sm">Flexible Payment Plans</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-primary" />
                          <span className="text-sm">Student Loans Available</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-primary" />
                          <span className="text-sm">Corporate Sponsorship</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center">
          <Link href="/apply">
            <Button size="lg" className="px-8">
              Start Your Application
            </Button>
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Questions about the admissions process? {" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact our admissions team
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}