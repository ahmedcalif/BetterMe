import Link from "next/link";
import { Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-full bg-sage-100 flex items-center justify-center mb-4">
        <Leaf className="w-8 h-8 text-sage-400" />
      </div>
      <h1 className="text-2xl font-bold text-bark-800 mb-2">Page not found</h1>
      <p className="text-bark-500 mb-6">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="btn-primary">
        Go home
      </Link>
    </div>
  );
}
