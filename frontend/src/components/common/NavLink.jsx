import { Link } from 'react-router-dom';

const NavLink = ({ to, children, style = {}, hoverStyle = {} }) => {
  const baseStyle = {
    color: '#1f2937',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    padding: '0.5rem',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    ...style
  };

  return (
    <Link
      to={to}
      style={baseStyle}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#f3f4f6';
        Object.assign(e.target.style, hoverStyle);
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'transparent';
        Object.assign(e.target.style, baseStyle);
      }}
    >
      {children}
    </Link>
  );
};

export default NavLink;