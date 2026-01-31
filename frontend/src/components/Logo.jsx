import { motion } from "framer-motion";

/**
 * BdAsk Logo Component - Premium Ocean Teal Design
 * Animated chat bubble with AI dots
 */
export const Logo = ({ 
  size = "md", 
  showText = false, 
  animate = true,
  className = "" 
}) => {
  const sizes = {
    sm: { icon: 32, text: 14 },
    md: { icon: 44, text: 18 },
    lg: { icon: 64, text: 24 },
    xl: { icon: 96, text: 32 }
  };
  
  const { icon: iconSize, text: textSize } = sizes[size] || sizes.md;
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <motion.div
        initial={animate ? { scale: 0, rotate: -180 } : false}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative"
        style={{ width: iconSize, height: iconSize }}
      >
        {/* Glow Effect */}
        <div 
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent opacity-50 blur-lg"
          style={{ transform: 'scale(1.2)' }}
        />
        
        {/* Main Icon Container */}
        <div 
          className="relative w-full h-full rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg overflow-hidden"
        >
          {/* Glass reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" style={{ height: '50%' }} />
          
          {/* Chat Bubble SVG */}
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className="relative z-10"
            style={{ width: iconSize * 0.55, height: iconSize * 0.55 }}
          >
            {/* Chat bubble shape */}
            <path 
              d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V14C20 15.1046 19.1046 16 18 16H10L6 20V16H6C4.89543 16 4 15.1046 4 14V6Z" 
              fill="white" 
              fillOpacity="0.95"
            />
            {/* AI dots */}
            <motion.circle 
              cx="8" cy="10" r="1.5" 
              fill="currentColor" 
              className="text-primary"
              animate={animate ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            />
            <motion.circle 
              cx="12" cy="10" r="1.5" 
              fill="currentColor" 
              className="text-primary"
              animate={animate ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.circle 
              cx="16" cy="10" r="1.5" 
              fill="currentColor" 
              className="text-primary"
              animate={animate ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
          </svg>
        </div>
      </motion.div>
      
      {/* Logo Text */}
      {showText && (
        <motion.div
          initial={animate ? { opacity: 0, x: -10 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 
            className="font-bold text-foreground bangla-heading"
            style={{ fontSize: textSize }}
          >
            বিডিআস্ক
          </h1>
          <p 
            className="text-muted-foreground"
            style={{ fontSize: textSize * 0.55 }}
          >
            Premium AI সহকারী
          </p>
        </motion.div>
      )}
    </div>
  );
};

/**
 * Logo Icon Only - For Favicon/Small spaces
 */
export const LogoIcon = ({ size = 40, className = "" }) => (
  <svg 
    viewBox="0 0 64 64" 
    className={className}
    style={{ width: size, height: size }}
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))' }} />
        <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))' }} />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="14" fill="url(#logoGradient)" />
    <path 
      d="M 14 18 Q 14 12 20 12 L 48 12 Q 54 12 54 18 L 54 38 Q 54 44 48 44 L 28 44 L 18 54 L 22 44 L 20 44 Q 14 44 14 38 Z" 
      fill="white" 
      fillOpacity="0.95"
    />
    <circle cx="24" cy="28" r="4" fill="url(#logoGradient)" />
    <circle cx="34" cy="28" r="4" fill="url(#logoGradient)" />
    <circle cx="44" cy="28" r="4" fill="url(#logoGradient)" />
  </svg>
);

export default Logo;
