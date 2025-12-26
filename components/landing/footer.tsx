import Link from 'next/link';
import { IconBrandTwitter, IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react';

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-br from-muted/30 to-primary/5">
      <div className="container mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2" aria-label="VacationPlanner Home">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">VacationPlanner</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              AI-powered vacation planning that makes travel dreams come true.
            </p>
            <nav className="mt-6 flex space-x-4" aria-label="Social media links">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Follow us on Twitter">
                <IconBrandTwitter className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Follow us on GitHub">
                <IconBrandGithub className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Follow us on LinkedIn">
                <IconBrandLinkedin className="h-5 w-5" aria-hidden="true" />
              </Link>
            </nav>
          </div>

          <nav className="col-span-1" aria-label="Product links">
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </nav>

          <nav className="col-span-1" aria-label="Company links">
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </nav>

          <nav className="col-span-1" aria-label="Resource links">
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} VacationPlanner. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

