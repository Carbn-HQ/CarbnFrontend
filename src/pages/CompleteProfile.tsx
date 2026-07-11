import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

const CompleteProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-border bg-white px-5 py-3.5 text-base text-charcoal outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !id || submitting) return;
    setSubmitting(true);
    try {
      const response = await axios.put(
        `https://carbnserver-f9eq.onrender.com/api/v1/update-waitlist-name/${id}`,
        {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        },
      );
      const data = response.data;
      if (data?.success) {
        localStorage.setItem("carbn_user_firstname", firstName.trim());
        localStorage.setItem("carbn_user_lastname", lastName.trim());
        toast({
          title: "Profile updated",
          description: `Welcome, ${firstName.trim()}.`,
        });
        // navigate("/dashboard");
      } else {
        toast({
          title: "Update failed",
          description: data?.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Network error",
        description: "Could not reach the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-charcoal">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/" className="font-display text-2xl font-bold tracking-tight text-charcoal">
            carbn<span className="text-primary">.</span>
          </a>
        </div>
        <div className="rounded-3xl bg-card p-8 shadow-soft">
          <h1 className="font-display text-2xl font-semibold text-charcoal">
            Tell us your name
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            One quick step so we know what to call you.
          </p>

          <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className={inputClass}
            />
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              className={inputClass}
            />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 font-extrabold uppercase tracking-wider text-sm text-primary-foreground transition-colors hover:bg-[hsl(var(--primary-hover))] disabled:opacity-60"
            >
              {submitting ? "Saving..." : (<>Continue <ArrowRight className="h-4 w-4" /></>)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
