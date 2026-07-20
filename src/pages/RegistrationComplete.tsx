import { useEffect, useState } from "react";
import { Check } from "lucide-react";

const RegistrationComplete = () => {
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("carbn_user_firstname");
    if (name) setFirstName(name);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-charcoal">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/" className="font-display text-2xl font-bold tracking-tight text-charcoal">
            carbn<span className="text-primary">.</span>
          </a>
        </div>

        <div className="rounded-3xl bg-card p-8 text-center shadow-soft">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check className="h-8 w-8" strokeWidth={2.5} />
          </div>

          <h1 className="mt-6 font-display text-2xl font-semibold text-charcoal">
            Registration completed
          </h1>
          <p className="mt-2 text-muted-foreground">
             Thanks, {firstName}. Your application to join the CARBN Founding Beta
  has been submitted successfully.
          </p>

         
          <p>
            The CARBN team will review your application and email you with the next step.
          </p>
          

          <a
            href="/"
            className="mt-8 inline-block text-sm font-medium text-muted-foreground transition-colors hover:text-charcoal"
          >
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegistrationComplete;
