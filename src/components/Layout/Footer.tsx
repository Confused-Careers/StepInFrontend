// import { Sparkles } from 'lucide-react'
import Logo from "../../assets/StepIn Transparent Logo.png";

const Footer = () => {
  return (
    <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} StepIn. All rights reserved.</p>
          </div>
        </div>
    </footer>
  )
}

export default Footer