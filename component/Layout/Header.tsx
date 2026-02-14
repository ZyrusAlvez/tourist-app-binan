'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import TextButton from '@/component/UI/TextButton'

const Header = () => {
  const pathname = usePathname()
  
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/team', label: 'Team' }
  ]
  
  return (
    <>
      <header className="w-full bg-[#fbf5df] backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image 
          src="/binan_logo.png" 
          alt="Binan Logo" 
          width={106.5} 
          height={60}
          className="h-15 w-auto"
          />
        </Link>
        
        {/* Navigation */}
        <nav className="flex gap-6 sm:gap-8">
          {navLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link 
            key={link.href}
            href={link.href} 
            className={`relative transition-all duration-300 ${
              isActive 
              ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-linear-to-r after:from-orange-400 after:to-green-400 after:rounded-full' 
              : ''
            }`}
            >
            <TextButton className="text-gray-700! hover:text-gray-900!">
              {link.label}
            </TextButton>
            </Link>
          )
          })}
        </nav>
        </div>
      </div>
      </header>
      
    </>
  )
}

export default Header