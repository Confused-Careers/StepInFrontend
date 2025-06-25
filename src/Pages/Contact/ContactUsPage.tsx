import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Logo from "../../assets/StepIn Transparent Logo.png";
import { useState } from "react";

const CompanyNavbar = () => {
    return (
        <header className="bg-black text-white">
            <div className="container mx-auto flex items-center justify-between p-4">
                <Link to="/" className="flex items-center gap-2">
                    <img src={Logo} alt="StepIn Logo" className="h-8 w-8" />
                    <span className="font-bold text-2xl text-white-500">StepIn</span>
                </Link>
            </div>
        </header>
    );
};

export default function ContactUsPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-black text-white min-h-screen">
      <CompanyNavbar />
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact Us</h1>
          <div className="mt-4 mx-auto h-px bg-blue-500 w-1/4"></div>
        </div>
        <div className="w-full border-t border-gray-700 mb-12"></div>
        {submitted ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <span className="text-lg sm:text-2xl font-medium text-center">
              Thank you! We’ll get back to you as soon as we can
            </span>
          </div>
        ) : (
          <form
            className="mt-12 max-w-xl mx-auto"
            onSubmit={e => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="space-y-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-left mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  className="bg-black border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-left mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  className="bg-black border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full"
                />
              </div>
              <div>
                <label htmlFor="inquiry" className="block text-sm font-medium text-left mb-2">
                  Inquiry
                </label>
                <Input
                  id="inquiry"
                  type="text"
                  className="bg-black border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full"
                />
              </div>
            </div>
            <div className="mt-10 text-center">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg text-base shadow-lg shadow-blue-600/50"
              >
                Submit
              </Button>
            </div>
          </form>
        )}
        <p className="mt-10 text-center text-gray-400">
          Or, reach out to{" "}
          <a href="mailto:support@stepincompany.com" className="text-blue-500 hover:underline">
            support@stepincompany.com
          </a>
        </p>
      </div>
    </div>
  );
}