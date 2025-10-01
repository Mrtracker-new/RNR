import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Container, Section, Grid, Card, Button, Badge } from '../styles/GlobalStyle';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';

const ContactHero = styled(Section)`
  padding-top: 140px;
  text-align: center;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  margin-bottom: var(--spacing-6);
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: var(--font-extrabold);
  letter-spacing: -0.025em;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: var(--text-xl);
  color: var(--dark-400);
  max-width: 600px;
  margin: 0 auto var(--spacing-16);
  line-height: 1.7;
`;

const ContactSection = styled(Section)``;

const ContactGrid = styled(Grid)`
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-16);
  align-items: start;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-12);
  }
`;

const ContactForm = styled(Card)`
  position: relative;
`;

const FormTitle = styled.h2`
  font-size: var(--text-2xl);
  color: var(--dark-100);
  margin-bottom: var(--spacing-6);
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-6);
`;

const FormLabel = styled.label`
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--dark-300);
  margin-bottom: var(--spacing-2);
`;

const FormInput = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: var(--spacing-4);
  font-size: var(--text-base);
  border: 2px solid ${props => props.hasError ? 'var(--error)' : 'var(--dark-600)'};
  border-radius: var(--radius-lg);
  background: var(--dark-800);
  color: var(--dark-100);
  transition: var(--transition-normal);

  &:focus {
    border-color: ${props => props.hasError ? 'var(--error)' : 'var(--accent-primary)'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 255, 218, 0.1)'};
  }

  &::placeholder {
    color: var(--dark-500);
  }
`;

const FormTextarea = styled.textarea<{ hasError?: boolean }>`
  width: 100%;
  min-height: 120px;
  padding: var(--spacing-4);
  font-size: var(--text-base);
  border: 2px solid ${props => props.hasError ? 'var(--error)' : 'var(--dark-600)'};
  border-radius: var(--radius-lg);
  background: var(--dark-800);
  color: var(--dark-100);
  transition: var(--transition-normal);
  resize: vertical;
  font-family: inherit;

  &:focus {
    border-color: ${props => props.hasError ? 'var(--error)' : 'var(--accent-primary)'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 255, 218, 0.1)'};
  }

  &::placeholder {
    color: var(--dark-500);
  }
`;


const SuccessMessage = styled(motion.div)`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: var(--success);
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-6);
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
`;

const ErrorMessage = styled.span`
  display: block;
  color: var(--error);
  font-size: var(--text-sm);
  margin-top: var(--spacing-1);
`;

const SubmitErrorMessage = styled(motion.div)`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: var(--error);
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-6);
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
`;


const ContactCard = styled(Card)`
  text-align: center;
  transition: var(--transition-normal);

  &:hover {
    transform: translateY(-5px);
    border-color: var(--accent-primary);
    box-shadow: 0 20px 40px rgba(100, 255, 218, 0.1);
  }
`;

const ContactIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-3xl);
  margin: 0 auto var(--spacing-6);
  color: var(--dark-950);
  box-shadow: var(--shadow-accent);
`;

const ContactTitle = styled.h3`
  font-size: var(--text-xl);
  color: var(--dark-100);
  margin-bottom: var(--spacing-4);
`;

const ContactDetails = styled.div`
  color: var(--dark-400);
  line-height: 1.6;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: var(--spacing-4);
  justify-content: center;
  margin-top: var(--spacing-6);
  flex-wrap: wrap;
`;

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: var(--dark-700);
  border: 1px solid var(--dark-600);
  border-radius: 50%;
  color: var(--dark-300);
  text-decoration: none;
  transition: var(--transition-normal);

  &:hover {
    background: var(--accent-primary);
    color: var(--dark-900);
    border-color: var(--accent-primary);
    transform: translateY(-2px);
  }

  svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
`;

// SVG Icon Components
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);


const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const LocationInfo = styled(Card)`
  text-align: left;
`;

const LocationTitle = styled.h3`
  font-size: var(--text-xl);
  color: var(--dark-100);
  margin-bottom: var(--spacing-4);
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
`;

const LocationDetails = styled.div`
  color: var(--dark-400);
  line-height: 1.8;
  
  p {
    margin-bottom: var(--spacing-3);
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
  }
  
  strong {
    color: var(--dark-200);
  }
`;


interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Create form data in the format Netlify expects
      const formDataToSubmit = new URLSearchParams();
      formDataToSubmit.append('form-name', 'contact');
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('subject', formData.subject);
      formDataToSubmit.append('message', formData.message);

      // Submit to Netlify Forms
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formDataToSubmit.toString()
      });

      if (response.ok) {
        console.log('Form submitted successfully');
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Form submission failed:', error);
      setSubmitError('Failed to send message. Please try again or contact me directly at rolanlobo901@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <SEO
        title="Contact Rolan Lobo - Get In Touch"
        description="Get in touch with Rolan Lobo for freelance projects, collaboration, or software development inquiries. Available for hire."
        url="https://rolan-rnr.netlify.app/contact"
      />
      <ContactHero>
        <Container>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <HeroTitle variants={itemVariants}>
              Let's Work Together
            </HeroTitle>
            <HeroSubtitle variants={itemVariants}>
              Have a project in mind or just want to say hello? I'd love to hear from you. 
              Let's discuss how we can bring your ideas to life.
            </HeroSubtitle>
          </motion.div>
        </Container>
      </ContactHero>

      <ContactSection>
        <Container>
          <ContactGrid
            as={motion.div}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <ContactForm>
                <FormTitle>
                  <span>💬</span>
                  Send me a message
                </FormTitle>

                {isSubmitted && (
                  <SuccessMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span>✅</span>
                    <span>Thank you! Your message has been sent successfully. I'll get back to you soon.</span>
                  </SuccessMessage>
                )}

                {submitError && (
                  <SubmitErrorMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span>❌</span>
                    <span>{submitError}</span>
                  </SubmitErrorMessage>
                )}

                <form name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={handleSubmit}>
                  <input type="hidden" name="form-name" value="contact" />
                  <p hidden>
                    <label>Don't fill this out: <input name="bot-field" /></label>
                  </p>
                  
                  <FormGroup>
                    <FormLabel htmlFor="name">Your Name</FormLabel>
                    <FormInput
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      hasError={!!errors.name}
                      required
                    />
                    {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel htmlFor="email">Email Address</FormLabel>
                    <FormInput
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      hasError={!!errors.email}
                      required
                    />
                    {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel htmlFor="subject">Subject</FormLabel>
                    <FormInput
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={handleInputChange}
                      hasError={!!errors.subject}
                      required
                    />
                    {errors.subject && <ErrorMessage>{errors.subject}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel htmlFor="message">Message</FormLabel>
                    <FormTextarea
                      id="message"
                      name="message"
                      placeholder="Tell me about your project or just say hello!"
                      value={formData.message}
                      onChange={handleInputChange}
                      hasError={!!errors.message}
                      required
                    />
                    {errors.message && <ErrorMessage>{errors.message}</ErrorMessage>}
                  </FormGroup>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    disabled={isSubmitting}
                    style={{ width: '100%' }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <span>🚀</span>
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </ContactForm>
            </motion.div>

            {/* Contact Information */}
            <motion.div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }} variants={itemVariants}>
              <ContactCard>
                <ContactIcon>📧</ContactIcon>
                <ContactTitle>Email Me</ContactTitle>
                <ContactDetails>
                  <p><strong>rolanlobo901@gmail.com</strong></p>
                  <p>I typically respond within 24 hours</p>
                </ContactDetails>
                <SocialLinks>
                  <SocialLink 
                    href="https://github.com/Mrtracker-new" 
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="GitHub Profile"
                  >
                    <GitHubIcon />
                  </SocialLink>
                  <SocialLink 
                    href="https://www.linkedin.com/in/rolan-lobo-93368a239/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="LinkedIn Profile"
                  >
                    <LinkedInIcon />
                  </SocialLink>
                  <SocialLink 
                    href="https://www.instagram.com/rolan_r_n_r/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Instagram Profile"
                  >
                    <InstagramIcon />
                  </SocialLink>
                </SocialLinks>
              </ContactCard>

              <LocationInfo>
                <LocationTitle>
                  <span>📍</span>
                  Location & Availability
                </LocationTitle>
                <LocationDetails>
                  <p>
                    <span>🏠</span>
                    <span><strong>Based in:</strong> Yellapur, Karnataka, India</span>
                  </p>
                  <p>
                    <span>🌍</span>
                    <span><strong>Timezone:</strong> IST (UTC +5:30)</span>
                  </p>
                  <p>
                    <span>💻</span>
                    <span><strong>Work:</strong> Remote & On-site projects</span>
                  </p>
                  <p>
                    <span>🚀</span>
                    <span><strong>Status:</strong></span>
                    <Badge variant="success" style={{ marginLeft: 'var(--spacing-2)' }}>
                      Available for new projects
                    </Badge>
                  </p>
                </LocationDetails>
              </LocationInfo>
            </motion.div>
          </ContactGrid>
        </Container>
      </ContactSection>
    </PageTransition>
  );
};

export default Contact;
