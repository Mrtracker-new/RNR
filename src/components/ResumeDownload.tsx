import React from 'react';
import { Button } from '../styles/GlobalStyle';

interface ResumeDownloadProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const ResumeDownload: React.FC<ResumeDownloadProps> = ({ 
  variant = 'outline', 
  size = 'lg' 
}) => {
  return (
    <Button
      as="a"
      href="/resume_rolan_lobo.pdf"
      download="Rolan_Lobo_Resume.pdf"
      variant={variant}
      size={size}
      aria-label="Download Rolan Lobo's Resume"
    >
      📄 Download Resume
    </Button>
  );
};

export default ResumeDownload;
