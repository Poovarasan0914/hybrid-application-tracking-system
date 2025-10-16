import { useEffect, useRef, useState } from 'react';

const AnimatedCard = ({ 
  children, 
  animation = 'fade', 
  delay = 0, 
  hover = true,
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const baseStyle = {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    padding: 12,
    background: '#fff'
  };

  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (animation === 'grow') {
      ref.current.style.transform = 'scale(0.95)';
      ref.current.style.opacity = '0';
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.transform = 'scale(1)';
          ref.current.style.opacity = '1';
        }
      }, delay);
    } else if (animation === 'slide') {
      ref.current.style.transform = 'translateY(12px)';
      ref.current.style.opacity = '0';
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.transform = 'translateY(0)';
          ref.current.style.opacity = '1';
        }
      }, delay);
    } else {
      ref.current.style.opacity = '0';
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.opacity = '1';
        }
      }, delay);
    }
  }, [animation, delay]);

  return (
    <div
      ref={ref}
      style={baseStyle}
      onMouseEnter={(e) => {
        if (!hover) return;
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        if (!hover) return;
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;