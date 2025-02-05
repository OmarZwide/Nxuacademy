import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Careers() {
  return (
    <main className="min-h-screen py-24">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">Career Development</h1>
          <p className="text-xl text-gray-600">
            Launch your career in cloud computing with NXU Academy's comprehensive career support services.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Career Guidance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                One-on-one mentoring sessions with industry professionals to guide your AWS career path.
              </p>
              <Button variant="outline" className="w-full">
                Book Session
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Exclusive access to AWS job opportunities from our corporate partners.
              </p>
              <Button variant="outline" className="w-full">
                View Opportunities
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resume Workshop</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Professional CV building and interview preparation tailored for cloud computing roles.
              </p>
              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
