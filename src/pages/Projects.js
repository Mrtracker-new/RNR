import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { FiFolder, FiGithub, FiExternalLink, FiDownload, FiX, FiSearch, FiCheck } from 'react-icons/fi';

const Projects = () => {
  const [filter, setFilter] = useState('all');
  
  // Custom setFilter function with logging
  const handleFilterChange = (newFilter) => {
    console.log('Filter changing from', filter, 'to', newFilter);
    // Force a re-render by using a callback to ensure state is updated
    setFilter(newFilter);
    // Add a timeout to log the filter after state update
    setTimeout(() => {
      console.log('Filter after update:', newFilter);
    }, 100);
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  // Layout is always grid, no toggle needed
  // Sort by newest by default (no dropdown needed)
  const modalRef = useRef(null);
  const projectsRef = useRef(null);
  const controls = useAnimation();

  // Add useEffect to handle filter changes
  useEffect(() => {
    console.log('Filter changed in useEffect:', filter);
    // Animate the controls when filter changes
    controls.start({ opacity: 1, y: 0 });
  }, [filter, controls]);

  // Helper function to get file type label
  const getFileTypeLabel = (fileType) => {
    switch(fileType) {
      case 'exe': return 'Windows Executable';
      case 'dmg': return 'Mac App';
      case 'apk': return 'Android App';
      default: return 'File';
    }
  };

  // Project data
  const projectsData = [
    {
      id: 1,
      title: 'InvisioVault-Desktop',
      description: 'InvisioVault is a desktop app that hides files (PDFs, media, etc.) inside images using AES-256 encryption. It supports PNG, JPG, BMP formats and offers batch processing with a clean, user-friendly interface.',
      longDescription: 'InvisioVault is a comprehensive desktop solution designed for secure information management. It features AES-256 encryption, biometric authentication, secure password generation, and an intuitive user interface. The application is built with Electron and React, making it compatible with Windows, macOS, and Linux. InvisioVault prioritizes user privacy by ensuring all data remains local and never transmitted to external servers.',
      image: '/images/InvisioVault.webp',
      tech: ['Python', 'Pillow (PIL)', 'AES‑256'],
      github: 'https://github.com/Mrtracker-new/InvisioVault-Desktop',
      downloadLink: 'https://github.com/Mrtracker-new/InvisioVault-Desktop/releases/download/v1.0.0/InvisioVault.exe',
      fileType: 'exe',
      category: 'desktop',
      featured: true,
    },
    {
      id: 2,
      title: 'BAR (Burn After Reading)',
      description: 'BAR (Burn After Reading) is a secure, offline desktop app for managing sensitive files. It scans for and handles .bar files across your devices, with no server dependencies to ensure your data stays local.',
      longDescription: 'BAR (Burn After Reading) is a powerful desktop application designed for secure file management with advanced security features including self-destruction capabilities. Operating entirely offline with no server dependencies, BAR ensures your sensitive data never leaves your machine.',
      image: '/images/BAR_logo.png',
      tech: ['Python', 'PyQt5', 'AES‑256‑GCM encryption', 'PBKDF2 key derivation'],
      github: 'https://github.com/Mrtracker-new/BAR',
      downloadLink: 'https://github.com/Mrtracker-new/BAR/releases/download/v1.0/BAR.exe',
      fileType: 'exe',
      category: 'desktop',
      featured: true,
    },
    {
      id: 3,
      title: 'Sortify',
      description: 'Sortify helps you automatically organize your files with easy-to-use commands. Clean up cluttered folders by sorting files based on type, — all in just a few clicks.',
      longDescription: 'Sortify is an intelligent file organization tool that automatically categorizes and organizes your files based on their formats, content, and metadata. It leverages AI and machine learning to understand file content and context, going beyond simple extension-based sorting.',
      image: '/images/Sortify.jpg',
      tech: ['Python', 'OS', 'shutil'],
      github: 'https://github.com/Mrtracker-new/Sortify?tab=readme-ov-file#-key-features',
      downloadLink: 'https://github.com/Mrtracker-new/Sortify/releases/download/v1.0/Sortify_Setup.exe',
      fileType: 'exe',
      category: 'desktop',
      featured: true,
    },
    {
      id: 4,
      title: 'InvisioVault',
      description: 'This is a Flask-based web application for file steganography, where users can hide a file within an image or extract a hidden file from an image.',
      longDescription: 'InvisioVault is a cutting-edge file-hiding web-application that allows you to securely embed files of any type into images. With its compression capabilities, even larger files can be seamlessly hidden in smaller images. Whether youre looking to protect sensitive data or explore creative file storage, InvisioVault has got you covered.',
      image: '/images/InvisioVault_web.jpg',
      tech: ['Python', 'HTML', 'CSS', 'Flask'],
      github: 'https://github.com/Mrtracker-new/InvisioVault',
      website: 'https://invisio-vault.vercel.app/',
      category: 'web',
      featured: false,
    },
    {
      id: 5,
      title: 'Contact-manager',
      description: 'A modern, cross-platform contact management application built with React and Capacitor, designed to simplify contact organization with rich document attachment capabilities.',
      longDescription: 'RNR Contact Manager is a modern contact management application that allows users to store contacts with rich profiles including photos, documents, tags, and group categorization. Built with React and Material UI, it offers a responsive interface that works seamlessly on both web and mobile platforms through Capacitor integration',
      image: '/images/RNR Contact.jpeg',
      tech: ['React', 'CSS'],
      github: 'https://github.com/Mrtracker-new/Contact-manager',
      downloadLink: 'https://github.com/Mrtracker-new/Contact-manager/releases/download/v1.0/Contact-Manager.apk',
      category: 'apk',
      featured: false,
    },
    {
      id: 6,
      title: 'YT-Downloader',
      description: 'A modern YouTube video/audio downloader web application with theme support, preview functionality, and download management.',
      longDescription: 'A modern and user-friendly YouTube video and audio downloader web application featuring both dark and light themes, video preview functionality, and advanced download management with progress tracking, real-time speed monitoring, and resume/pause capabilities.',
      image: '/images/YT.jpeg',
      tech: ['Python', 'JavaScript', 'HTML', 'CSS'],
      github: 'https://github.com/Mrtracker-new/YT-Downloader',
      category: 'web',
      featured: false,
    },
    {
      id: 7,
      title: 'CursorCam',
      description: 'CursorCam: Hands-Free Mouse Control CursorCam uses facial recognition to control the mouse via your laptop’s camera, providing a hands-free, accessible way to navigate your computer.',
      longDescription: 'CursorCam is a Flask-based web application that transforms your laptops camera into a mouse controller using facial recognition. By tracking facial movements, the application mimics mouse movements, allowing you to control your device hands-free. The system incorporates advanced calibration and user profiles for customization and accuracy.',
      image: '/images/CursorCam.webp',
      tech: ['Python', 'JavaScript'],
      github: 'https://github.com/Mrtracker-new/CursorCam',
      category: 'web',
      featured: false,
    },
    {
      id: 8,
      title: 'RNR',
      description: 'MY portfolio Website built with React',
      longDescription: 'RNR is my portfolio website, where I showcase my skills, projects, and experiences. Its built with React, Styled Components, and Framer Motion, and its hosted on Vercel. You can explore my work, learn about my background, and get in touch with me through the contact form.',
      image: '/images/rnr.jpeg',
      tech: ['React', 'HTML', 'CSS'],
      github: 'https://github.com/Mrtracker-new/RNR',
      category: 'web',
      featured: false,
    }
  ];

  // Filter and sort projects based on category, search term, and sort option
  console.log('Current filter:', filter);
  console.log('Project data categories:', projectsData.map(p => ({ id: p.id, title: p.title, category: p.category })));
  
  const filteredProjects = projectsData.filter(project => {
    // Check if project category matches the selected filter
    // This is where the issue was - the condition wasn't correctly matching categories
    const matchesCategory = filter === 'all' || project.category === filter;
    
    // Check if project matches the search term
    const matchesSearch = searchTerm === '' || 
                          project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.tech.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Debug logging for each project
    console.log(`Project ${project.id} (${project.title}) - Category: ${project.category}, Matches filter '${filter}': ${matchesCategory}`);
    
    return matchesCategory && matchesSearch;
  
  }).sort((a, b) => {
    // Always sort by newest (by id)
    return b.id - a.id;
  });
  
  console.log('Filtered projects:', filteredProjects.map(p => ({ id: p.id, title: p.title, category: p.category })));
  
  // Get featured projects for special display
  const featuredProjects = projectsData.filter(project => project.featured);

  // Handle project click to open modal
  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  // Close modal on escape key press
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  // Animate projects when filter or search changes
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1 }
    });
  }, [filter, searchTerm, controls]);

  return (
    <ProjectsContainer>
      <Container>
        <PageHeader>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            My Projects
          </motion.h1>
          <motion.div
            className="underline"
            initial={{ width: 0 }}
            animate={{ width: '100px' }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </PageHeader>

        <SearchAndFilterContainer>
          <FilterSection>
            <FilterLabel>Filter by:</FilterLabel>
            <FilterContainer>
              <FilterButton 
                active={filter === 'all'}
                onClick={() => handleFilterChange('all')}
                as={motion.button}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                All
              </FilterButton>
              <FilterButton 
                active={filter === 'web'}
                onClick={() => handleFilterChange('web')}
                as={motion.button}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                Web
              </FilterButton>
              <FilterButton 
                active={filter === 'desktop'}
                onClick={() => handleFilterChange('desktop')}
                as={motion.button}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                Desktop
              </FilterButton>
              <FilterButton 
                active={filter === 'apk'}
                onClick={() => handleFilterChange('apk')}
                as={motion.button}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                APK
              </FilterButton>
            </FilterContainer>
          </FilterSection>
          
          <ControlsContainer>
            {/* Sort dropdown and view toggle removed */}
            
            <SearchContainer>
              <SearchIcon>
                <FiSearch />
              </SearchIcon>
              <SearchInput 
                type="text" 
                placeholder="Search projects or technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <ClearSearchButton onClick={() => setSearchTerm('')}>
                  <FiX />
                </ClearSearchButton>
              )}
            </SearchContainer>
          </ControlsContainer>
        </SearchAndFilterContainer>
        
        <ProjectsCount>
          Showing {filteredProjects.length} of {projectsData.length} projects
        </ProjectsCount>

        {filteredProjects.length === 0 ? (
          <NoResultsMessage>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FiSearch size={40} />
              <h3>No projects found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <ResetButton onClick={() => { setSearchTerm(''); setFilter('all'); }}>
                Reset Filters
              </ResetButton>
            </motion.div>
          </NoResultsMessage>
        ) : (
          <div ref={projectsRef}>
            {/* Featured Projects Section (only shown when filter is 'all' and no search term) */}
            {filter === 'all' && !searchTerm && featuredProjects.length > 0 && (
              <FeaturedSection>
                <SectionTitle>Featured Projects</SectionTitle>
                <FeaturedProjectsGrid>
                  <AnimatePresence mode="wait" key={filter}>
                    {featuredProjects.map((project) => (
                      <FeaturedProjectCard
                        key={project.id}
                        as={motion.div}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -10, transition: { duration: 0.2 } }}
                        onClick={() => handleProjectClick(project)}
                      >
                        <FeaturedImageContainer>
                          <ProjectImage src={project.image} alt={project.title} />
                          <ProjectOverlay>
                            <ViewDetailsButton>View Details</ViewDetailsButton>
                          </ProjectOverlay>
                          <CategoryBadge category={project.category}>
                            {project.category === 'web' ? 'Web App' : 
                             project.category === 'apk' ? 'Android App' : 
                             'Desktop App'}
                          </CategoryBadge>
                        </FeaturedImageContainer>
                        
                        <FeaturedContent>
                          <ProjectHeader>
                            <ProjectTitle>{project.title}</ProjectTitle>
                            <ProjectLinks>
                              <ProjectLink 
                                href={project.github} 
                                target="_blank"
                                rel="noopener noreferrer"
                                as={motion.a}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FiGithub size={20} />
                              </ProjectLink>
                              {project.website && (
                                <ProjectLink 
                                  href={project.website} 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  as={motion.a}
                                  whileHover={{ y: -5 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <FiExternalLink size={20} />
                                </ProjectLink>
                              )}
                              {project.downloadLink && (
                                <ProjectLink 
                                  href={project.downloadLink} 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  as={motion.a}
                                  whileHover={{ y: -5 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => e.stopPropagation()}
                                  title={`Download ${getFileTypeLabel(project.fileType)}`}
                                >
                                  <FiDownload size={20} />
                                </ProjectLink>
                              )}
                            </ProjectLinks>
                          </ProjectHeader>
                          <ProjectDescription>{project.description}</ProjectDescription>
                          <ProjectTechList>
                            {project.tech.map((tech, index) => (
                              <ProjectTechItem key={index}>{tech}</ProjectTechItem>
                            ))}
                          </ProjectTechList>
                        </FeaturedContent>
                      </FeaturedProjectCard>
                    ))}
                  </AnimatePresence>
                </FeaturedProjectsGrid>
              </FeaturedSection>
            )}
            
            {/* All Projects Section */}
            {filter === 'all' && !searchTerm && featuredProjects.length > 0 && (
              <SectionTitle>All Projects</SectionTitle>
            )}
            
            <ProjectsGrid>
                <AnimatePresence mode="wait" key={filter}>
                  {console.log('Rendering projects in UI:', filteredProjects.map(p => p.title))}
                  {filteredProjects
                    .map((project) => (
                    <ProjectCard
                      key={project.id}
                      as={motion.div}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -10, transition: { duration: 0.2 } }}
                      onClick={() => handleProjectClick(project)}
                    >
                      <ProjectImageContainer>
                        <ProjectImage src={project.image} alt={project.title} />
                        <ProjectOverlay>
                          <ViewDetailsButton>View Details</ViewDetailsButton>
                        </ProjectOverlay>
                        <CategoryBadge category={project.category}>
                          {project.category === 'web' ? 'Web App' : 
                           project.category === 'apk' ? 'Android App' : 
                           'Desktop App'}
                        </CategoryBadge>
                      </ProjectImageContainer>
                      
                      <ProjectContent>
                        <ProjectHeader>
                          <ProjectIcon>
                            <FiFolder size={30} />
                          </ProjectIcon>
                          <ProjectLinks>
                            <ProjectLink 
                              href={project.github} 
                              target="_blank"
                              rel="noopener noreferrer"
                              as={motion.a}
                              whileHover={{ y: -5 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => e.stopPropagation()} // Prevent card click when clicking link
                            >
                              <FiGithub size={20} />
                            </ProjectLink>
                            {project.website && (
                              <ProjectLink 
                                href={project.website} 
                                target="_blank"
                                rel="noopener noreferrer"
                                as={motion.a}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => e.stopPropagation()} // Prevent card click when clicking link
                              >
                                <FiExternalLink size={20} />
                              </ProjectLink>
                            )}
                            {project.downloadLink && (
                              <ProjectLink 
                                href={project.downloadLink} 
                                target="_blank"
                                rel="noopener noreferrer"
                                as={motion.a}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => e.stopPropagation()} // Prevent card click when clicking link
                                title={`Download ${getFileTypeLabel(project.fileType)}`}
                              >
                                <FiDownload size={20} />
                              </ProjectLink>
                            )}
                          </ProjectLinks>
                        </ProjectHeader>
                        <ProjectTitle>{project.title}</ProjectTitle>
                        <ProjectDescription>{project.description}</ProjectDescription>
                        <ProjectTechList>
                          {project.tech.map((tech, index) => (
                            <ProjectTechItem key={index}>{tech}</ProjectTechItem>
                          ))}
                        </ProjectTechList>
                      </ProjectContent>
                    </ProjectCard>
                  ))}
                </AnimatePresence>
              </ProjectsGrid>
          </div>
        )}

        {/* Project Detail Modal */}
        <AnimatePresence>
          {isModalOpen && selectedProject && (
            <ModalOverlay
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <ModalContent
                ref={modalRef}
                as={motion.div}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', damping: 25 }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
              >
                <ModalCloseButton onClick={closeModal}>
                  <FiX size={24} />
                </ModalCloseButton>
                
                <ModalImageContainer>
                  <ModalImage src={selectedProject.image} alt={selectedProject.title} />
                  <ModalCategoryBadge category={selectedProject.category}>
                    {selectedProject.category === 'web' ? 'Web App' : 
                     selectedProject.category === 'apk' ? 'Android App' : 
                     'Desktop App'}
                  </ModalCategoryBadge>
                  {selectedProject.featured && (
                    <ModalFeaturedBadge>Featured</ModalFeaturedBadge>
                  )}
                </ModalImageContainer>
                
                <ModalBody>
                  <ModalHeader>
                    <ModalTitle>{selectedProject.title}</ModalTitle>
                    <ModalLinks>
                      <ModalLink 
                        href={selectedProject.github} 
                        target="_blank"
                        rel="noopener noreferrer"
                        as={motion.a}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiGithub size={20} />
                        <span>View Code</span>
                      </ModalLink>
                      {selectedProject.website && (
                        <ModalLink 
                          href={selectedProject.website} 
                          target="_blank"
                          rel="noopener noreferrer"
                          as={motion.a}
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FiExternalLink size={20} />
                          <span>Live Demo</span>
                        </ModalLink>
                      )}
                      {selectedProject.downloadLink && (
                        <ModalLink 
                          href={selectedProject.downloadLink} 
                          target="_blank"
                          rel="noopener noreferrer"
                          as={motion.a}
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.95 }}
                          className={selectedProject.fileType}
                        >
                          <FiDownload size={20} />
                          <span>Download {getFileTypeLabel(selectedProject.fileType)}</span>
                        </ModalLink>
                      )}
                    </ModalLinks>
                  </ModalHeader>
                  
                  <ModalDescription>
                    {selectedProject.longDescription}
                  </ModalDescription>
                  
                  <ModalTechSection>
                    <ModalSectionTitle>Technologies Used</ModalSectionTitle>
                    <ModalTechList>
                      {selectedProject.tech.map((tech, index) => (
                        <ModalTechItem key={index}>{tech}</ModalTechItem>
                      ))}
                    </ModalTechList>
                  </ModalTechSection>
                  
                  {selectedProject.features && selectedProject.features.length > 0 && (
                    <ModalFeaturesSection>
                      <ModalSectionTitle>Key Features</ModalSectionTitle>
                      <ModalFeaturesList>
                        {selectedProject.features.map((feature, index) => (
                          <ModalFeatureItem key={index}>
                            <FiCheck size={16} color="#64ffda" />
                            <span>{feature}</span>
                          </ModalFeatureItem>
                        ))}
                      </ModalFeaturesList>
                    </ModalFeaturesSection>
                  )}
                </ModalBody>
              </ModalContent>
            </ModalOverlay>
          )}
        </AnimatePresence>
      </Container>
    </ProjectsContainer>
  );
};

// Styled Components
const ProjectsContainer = styled.div`
  min-height: 100vh;
  padding: 100px 0;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};

  @media (max-width: 768px) {
    padding: 100px 0 80px 0;
  }
  
  @media (max-width: 480px) {
    padding: 100px 0 60px 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  
  @media (max-width: 480px) {
    padding: 0 15px;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 50px;
  text-align: center;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    color: ${({ theme }) => theme.primary};
  }

  .underline {
    height: 4px;
    background-color: ${({ theme }) => theme.accent};
    margin: 0 auto;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 40px;
    
    h1 {
      font-size: 2.2rem;
    }
  }
  
  @media (max-width: 480px) {
    margin-bottom: 30px;
    
    h1 {
      font-size: 1.8rem;
    }
  }
`;

const SearchAndFilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 30px;
    gap: 15px;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterLabel = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border-radius: 30px;
  border: none;
  background-color: ${({ active, theme }) => active ? theme.accent : theme.cardBackground};
  color: ${({ active, theme }) => active ? theme.buttonText : theme.text};
  font-weight: ${({ active }) => active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme, active }) => active ? theme.accent : theme.cardBackgroundHover};
  }
`;

// eslint-disable-next-line no-unused-vars
const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProjectsCount = styled.div`
  margin: 20px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.textLight || '#8892b0'};
  text-align: center;
  
  @media (max-width: 768px) {
    margin: 15px 0;
    font-size: 12px;
  }
`;

// eslint-disable-next-line no-unused-vars
const SortLabel = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
`;

// eslint-disable-next-line no-unused-vars
const SortSelect = styled.select`
  padding: 8px 12px;
  border-radius: 30px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background-color: ${({ theme }) => theme.cardBackground};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: ${({ theme }) => theme.accent};
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

// View toggle components removed


const SearchContainer = styled.div`
  position: relative;
  width: 250px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 35%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.textLight};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
`;



const SearchInput = styled.input`
  width: 100%;
  padding: 10px 40px 10px 35px;
  border-radius: 30px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.cardBackground};
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.accent}33`};
  }

  &::placeholder {
    color: ${({ theme }) => theme.textLight};
  }
`;

const ClearSearchButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.textLight};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.cardBackgroundHover};
    color: ${({ theme }) => theme.text};
  }
`;

const NoResultsMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.textLight};

  h3 {
    margin: 20px 0 10px;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin-bottom: 20px;
  }
`;

const ResetButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.primary};
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, ${({ theme }) => theme.accent}, transparent);
  }
`;

const FeaturedSection = styled.div`
  margin-bottom: 3rem;
`;

const FeaturedProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-top: 20px;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 25px;
  }
`;

const FeaturedProjectCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  border: 2px solid ${({ theme }) => theme.accent};
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 480px) {
    margin: 0 auto;
    width: 100%;
    max-width: 400px;
  }
`;

const FeaturedImageContainer = styled.div`
  position: relative;
  height: 220px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  @media (max-width: 480px) {
    height: 200px;
  }
  
  &:hover {
    img {
      transform: scale(1.05);
    }
    
    div {
      opacity: 1;
    }
  }
`;

const FeaturedContent = styled.div`
  padding: 25px;
  flex: 1;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const CategoryBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${props => 
    props.category === 'web' ? 'rgba(100, 255, 218, 0.9)' : 
    props.category === 'apk' ? 'rgba(77, 175, 124, 0.9)' : 
    'rgba(255, 100, 100, 0.9)'};
  color: ${props => 
    props.category === 'web' ? '#112240' : 
    props.category === 'apk' ? '#ffffff' : 
    '#ffffff'};
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;



// Removed duplicate FeaturedProjectCard declaration

const ProjectImageContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;

  @media (max-width: 480px) {
    height: 180px;
  }

  &:hover {
    img {
      transform: scale(1.05);
    }

    div {
      opacity: 1;
    }
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

const ProjectOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const ViewDetailsButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ProjectContent = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const ProjectIcon = styled.div`
  color: ${({ theme }) => theme.accent};
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 15px;
`;

const ProjectLink = styled.a`
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.accent};
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.primary};
`;

const ProjectDescription = styled.p`
  color: ${({ theme }) => theme.text};
  margin-bottom: 15px;
  flex: 1;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const ProjectTechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: auto;
  gap: 8px;
  
  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 10px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.background};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.accent};
    border-radius: 4px;
  }
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: ${({ theme }) => theme.cardBackgroundHover};
  color: ${({ theme }) => theme.text};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.buttonText};
  }
`;

const ModalImageContainer = styled.div`
  width: 100%;
  height: 300px;
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    height: 200px;
  }
`;

const ModalImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ModalBody = styled.div`
  padding: 30px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.primary};

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ModalDescription = styled.p`
  line-height: 1.6;
  margin-bottom: 30px;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
`;

const ModalTechSection = styled.div`
  margin-bottom: 30px;
`;

const ModalSectionTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.primary};
`;

const ModalTechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ModalTechItem = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.tagBackground};
  padding: 6px 12px;
  border-radius: 30px;
  display: inline-block;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 4px 10px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 3px 8px;
  }
`;

const ModalLinks = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const ModalCategoryBadge = styled.div`
  position: absolute;
  top: 15px;
  right: 70px;
  background: ${props => 
    props.category === 'web' ? 'rgba(100, 255, 218, 0.9)' : 
    props.category === 'apk' ? 'rgba(77, 175, 124, 0.9)' : 
    'rgba(255, 100, 100, 0.9)'};
  color: ${props => 
    props.category === 'web' ? '#112240' : 
    props.category === 'apk' ? '#ffffff' : 
    '#ffffff'};
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 480px) {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
    right: 60px;
  }
`;

const ModalFeaturedBadge = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.buttonText};
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 480px) {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
  }
`;

const ModalFeaturesSection = styled.div`
  margin-bottom: 30px;
  
  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const ModalFeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const ModalFeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  span {
    font-size: 1rem;
    color: ${({ theme }) => theme.text};
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    
    span {
      font-size: 0.9rem;
    }
  }
`;

const ProjectTechItem = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textLight};
  background-color: ${({ theme }) => theme.tagBackground};
  padding: 4px 10px;
  border-radius: 30px;
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 3px 8px;
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 25px;
  }
`;

const ProjectCard = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.border};
  position: relative;
  cursor: pointer;

  ${({ featured, theme }) => featured && `
    border: 2px solid ${theme.accent};
    &::after {
      content: 'Featured';
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: ${theme.accent};
      color: ${theme.buttonText};
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: bold;
      z-index: 1;
    }
  `}

  &:hover {
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
    border-color: ${({ theme }) => theme.accent};
  }
  
  @media (max-width: 480px) {
    margin: 0 auto;
    width: 100%;
    max-width: 400px;
  }
`;

// List view components removed

// List view header, links, and tech components removed

const ModalLink = styled.a`
  display: inline-flex;
  align-items: center;
  margin-right: 20px;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover, &:active {
    color: var(--accent);
    transform: translateY(-2px);
  }
  
  svg {
    margin-right: 8px;
  }
  
  @media (max-width: 768px) {
    margin-right: 15px;
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    margin-right: 10px;
    font-size: 13px;
    
    svg {
      margin-right: 6px;
    }
  }
`;

export default Projects;