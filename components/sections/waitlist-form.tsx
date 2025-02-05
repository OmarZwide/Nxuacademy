import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { waitlistSchema, type WaitlistFormData } from "@/lib/validations";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const courseGroups = [
  {
    name: "Foundational",
    courses: [
      {
        id: "AWS_CLOUD_PRACTITIONER",
        label: "AWS Certified Cloud Practitioner",
        description: "Validate overall understanding of the AWS Cloud",
      },
      {
        id: "AWS_TECHNICAL_ESSENTIALS",
        label: "AWS Technical Essentials",
        description: "Essential technical concepts of AWS services",
      },
    ],
  },
  {
    name: "Associate Certifications",
    courses: [
      {
        id: "AWS_SOLUTIONS_ARCHITECT_ASSOCIATE",
        label: "AWS Certified Solutions Architect – Associate",
        description: "Design highly available, cost-efficient AWS solutions",
      },
      {
        id: "AWS_DEVELOPER_ASSOCIATE",
        label: "AWS Certified Developer – Associate",
        description: "Build and deploy AWS cloud applications",
      },
      {
        id: "AWS_SYSOPS_ADMINISTRATOR_ASSOCIATE",
        label: "AWS Certified SysOps Administrator – Associate",
        description: "Manage and operate AWS environments",
      },
    ],
  },
  {
    name: "Professional Certifications",
    courses: [
      {
        id: "AWS_SOLUTIONS_ARCHITECT_PROFESSIONAL",
        label: "AWS Certified Solutions Architect – Professional",
        description: "Design complex, enterprise-scale AWS solutions",
      },
      {
        id: "AWS_DEVOPS_ENGINEER_PROFESSIONAL",
        label: "AWS Certified DevOps Engineer – Professional",
        description: "Implement and manage continuous delivery systems on AWS",
      },
    ],
  },
  {
    name: "Specialty Certifications",
    courses: [
      {
        id: "AWS_MACHINE_LEARNING_SPECIALTY",
        label: "AWS Certified Machine Learning – Specialty",
        description: "Design and implement ML solutions on AWS",
      },
      {
        id: "AWS_DATA_ANALYTICS_SPECIALTY",
        label: "AWS Certified Data Analytics – Specialty",
        description: "Design and maintain data analytics solutions",
      },
      {
        id: "AWS_DATABASE_SPECIALTY",
        label: "AWS Certified Database – Specialty",
        description: "Design and maintain AWS database solutions",
      },
      {
        id: "AWS_SECURITY_SPECIALTY",
        label: "AWS Certified Security – Specialty",
        description: "Secure AWS applications and architectures",
      },
      {
        id: "AWS_ADVANCED_NETWORKING_SPECIALTY",
        label: "AWS Certified Advanced Networking – Specialty",
        description: "Design and implement AWS and hybrid networking solutions",
      },
    ],
  },
  {
    name: "Practical Training",
    courses: [
      {
        id: "AWS_CLOUD_QUEST",
        label: "AWS Cloud Quest",
        description: "Role-playing learning game for cloud skills",
      },
      {
        id: "AWS_INDUSTRY_QUEST",
        label: "AWS Industry Quest",
        description: "Industry-specific cloud solutions training",
      },
    ],
  },
];

export function WaitlistForm() {
  const [submitted, setSubmitted] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      fullName: "",
      email: "",
      referralCode: null,
      courseInterests: ["AWS_CLOUD_PRACTITIONER"],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: WaitlistFormData) => {
      try {
        const res = await apiRequest("POST", "/api/waitlist", data);
        const responseData = await res.json();
        return responseData;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error("Failed to submit form");
      }
    },
    onSuccess: (data) => {
      setSubmitted(true);
      setReferralCode(data.referralCode);
      toast({
        title: "Success!",
        description: "You've been added to the waitlist.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to join waitlist. Please try again.",
      });
    },
  });

  const copyReferralCode = async () => {
    if (referralCode) {
      try {
        await navigator.clipboard.writeText(referralCode);
        toast({
          title: "Copied!",
          description: "Referral code copied to clipboard",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to copy code. Please try again.",
        });
      }
    }
  };

  if (submitted && referralCode) {
    return (
      <div className="text-center p-8">
        <h3 className="text-2xl font-bold mb-4">Thank you for joining!</h3>
        <p className="text-gray-600 mb-6">
          We'll notify you when we're ready to launch.
        </p>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2">Share with friends</h4>
            <p className="text-sm text-gray-500 mb-4">
              Share your referral code with friends and track your invites
            </p>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <code className="text-purple-600 font-mono">{referralCode}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyReferralCode}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div id="waitlist" className="mx-auto max-w-md space-y-8 p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Join the Waitlist</h2>
        <p className="text-gray-500 mt-2">
          Be among the first to experience our revolutionary learning platform
        </p>
      </div>

      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))} 
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseInterests"
            render={() => (
              <FormItem>
                <FormLabel>Course Interests</FormLabel>
                <Accordion type="single" collapsible className="w-full">
                  {courseGroups.map((group, groupIndex) => (
                    <AccordionItem key={groupIndex} value={`group-${groupIndex}`}>
                      <AccordionTrigger className="text-left">
                        {group.name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          {group.courses.map((course) => (
                            <FormField
                              key={course.id}
                              control={form.control}
                              name="courseInterests"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={course.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(course.id)}
                                        onCheckedChange={(checked) => {
                                          const currentValue = field.value || [];
                                          const newValue = checked
                                            ? [...currentValue, course.id]
                                            : currentValue.filter((value) => value !== course.id);
                                          field.onChange(newValue);
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-normal">
                                        {course.label}
                                      </FormLabel>
                                      <p className="text-sm text-gray-500">
                                        {course.description}
                                      </p>
                                    </div>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referralCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Referral Code (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter referral code" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Submitting..." : "Join Waitlist"}
          </Button>
        </form>
      </Form>
    </div>
  );
}