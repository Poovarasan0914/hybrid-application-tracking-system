import { Card, Fade, Grow, Slide } from '@mui/material';
import { useState } from 'react';

const AnimatedCard = ({ 
  children, 
  animation = 'fade', 
  delay = 0, 
  hover = true,
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const cardStyle = {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    ...(hover && {
      '&:hover': {
        transform: 'translateY(-4px) scale(1.02)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
      },
    }),
  };

  const renderAnimation = () => {
    const cardElement = (
      <Card sx={cardStyle} {...props}>
        {children}
      </Card>
    );

    switch (animation) {
      case 'grow':
        return (
          <Grow in={isVisible} timeout={600} style={{ transitionDelay: `${delay}ms` }}>
            {cardElement}
          </Grow>
        );
      case 'slide':
        return (
          <Slide in={isVisible} direction="up" timeout={600} style={{ transitionDelay: `${delay}ms` }}>
            {cardElement}
          </Slide>
        );
      default:
        return (
          <Fade in={isVisible} timeout={600} style={{ transitionDelay: `${delay}ms` }}>
            {cardElement}
          </Fade>
        );
    }
  };

  return renderAnimation();
};

export default AnimatedCard;