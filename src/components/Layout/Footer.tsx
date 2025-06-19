// import { Sparkles } from 'lucide-react'
import Logo from "../../assets/StepIn Transparent Logo.png";
import { Instagram, Linkedin, X } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t py-12 bg-muted/30">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-2 mb-2">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="StepIn Logo" className="h-8 w-8" />
            <span className="font-bold text-lg">StepIn</span>
          </div>
          <p className="text-base text-muted-foreground mb-4 text-center md:text-left max-w-md">
            AI-powered job matching that finds roles where you'll thrive
          </p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-2">
          <span className="font-semibold text-base mb-1">Contact Us</span>
          <div className="flex gap-4 mb-2">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
              <X className="h-6 w-6 hover:text-primary transition-colors" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="h-6 w-6 hover:text-primary transition-colors" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className="h-6 w-6 hover:text-primary transition-colors" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t pt-8 text-center text-sm text-muted-foreground w-full mt-8">
        <p>© {new Date().getFullYear()} StepIn. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer