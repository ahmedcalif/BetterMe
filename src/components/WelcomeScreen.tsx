import { Leaf } from "lucide-react";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";

export function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="mb-8 animate-grow">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sage-200 to-forest-200 flex items-center justify-center">
          <Leaf className="w-12 h-12 text-forest-500" />
        </div>
      </div>

      <h1 className="text-4xl font-bold text-bark-800 mb-4 animate-slide-up">
        Welcome to BetterME
      </h1>

      <p className="text-lg text-bark-500 max-w-md mb-8 animate-slide-up animation-delay-100">
        A calm space to nurture your goals, one season at a time.
      </p>

      <div className="flex gap-4 animate-slide-up animation-delay-200">
        <LoginLink className="btn-primary text-lg px-8 py-3">Sign In</LoginLink>
        <RegisterLink className="btn-secondary text-lg px-8 py-3">
          Get Started
        </RegisterLink>
      </div>
    </div>
  );
}
