import { ArrowRight, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Logo from "../../assets/StepIn Transparent Logo.png";

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    
  return (
    <header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
            <a href='/' className='flex items-center gap-2'>
                <img src={Logo} alt="StepIn Logo" className="h-6 w-6" />
                {/* <Sparkles className="h-6 w-6 text-primary animate-pulse-slow" /> */}
                <span className="text-xl font-bold">StepIn</span>
            </a>
        </div>

        <nav className="hidden md:flex items-center gap-6">
            {/* <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                How It Works
            </a>
            <a href="#jobs" className="text-sm font-medium hover:text-primary transition-colors">
                Jobs
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
                Testimonials
            </a> */}
        </nav>

        <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/individual-login")} className="hidden md:inline-flex">
            Log in
            </Button>
            <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
        </div>
        </div>

        {mobileMenuOpen && (
        <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="container py-4 flex flex-col space-y-4 border-t">
            {/* <a
                href="#features"
                className="text-sm font-medium hover:text-primary transition-colors px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
            >
                Features
            </a>
            <a
                href="#how-it-works"
                className="text-sm font-medium hover:text-primary transition-colors px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
            >
                How It Works
            </a>
            <a
                href="#testimonials"
                className="text-sm font-medium hover:text-primary transition-colors px-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
            >
                Testimonials
            </a> */}
            <Button onClick={() => navigate("/login")} variant="ghost" className="justify-start">
                Log in
            </Button>
            <Button onClick={() => navigate("/onboarding")} className="justify-start group">
                Begin
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            </div>
        </motion.div>
        )}
    </header>
  )
}

export default Navbar