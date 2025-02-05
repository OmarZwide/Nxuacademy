import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster.tsx";
import NotFound from "./pages/not-found.tsx";
import Home from "./pages/home.tsx";
import Cart from "./pages/cart.tsx";
import Courses from "./pages/courses.tsx";
import About from "./pages/about.tsx";
import DashboardPreview from "./pages/dashboard-preview.tsx";
import { LanguageProvider } from "./lib/i18n/LanguageContext.tsx";
import { Navigation } from "./components/ui/navigation.tsx";

// Import all page components
import Admissions from "./pages/admissions.tsx";
import Partnerships from "./pages/partnerships.tsx";
import Contact from "./pages/contact.tsx";
import Careers from "./pages/careers.tsx";
import DeploymentTest from "./pages/deployment-test.tsx";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <div className="relative min-h-screen">
          <Navigation />
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/courses" component={Courses} />
            <Route path="/about" component={About} />
            <Route path="/admissions" component={Admissions} />
            <Route path="/partnerships" component={Partnerships} />
            <Route path="/contact" component={Contact} />
            <Route path="/careers" component={Careers} />
            <Route path="/dashboard-preview" component={DashboardPreview} />
            <Route path="/cart" component={Cart} />
            <Route path="/deployment-test" component={DeploymentTest} />
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </div>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
