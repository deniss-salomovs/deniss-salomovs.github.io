const projectsData = [
    {
        id: 'ether',
        name: 'Ether',
        type: 'project',
        role: 'Lead Pixel Artist, Animator, Community Support',
        year: '15 Aug, 2024',
        description: 'First commercial release on Steam. Served as lead pixel artist and animator in an international team, gaining strong experience in finishing a complete product.',
        headerImage: 'assets/projects/ether/header.webp',
        links: [
            {
                url: 'https://store.steampowered.com/app/3107730/Ether/',
                icon: 'assets/icons/steam.webp'
            }
        ],
        gallery: {
            path: 'assets/projects/ether/'
        }
    },
    {
        id: 'dicechess',
        name: 'dicechess.com',
        type: 'project',
        role: 'Digital artist, Designer',
        year: '2023-present',
        description: 'Core professional experience working on an ever-evolving web game, involving a wide range of technical and design challenges.',
        headerImage: 'assets/projects/dicechess/header.webp',
        links: [
            {
                url: 'https://dicechess.com',
                icon: 'assets/icons/dicechess.svg'
            }
        ],
        gallery: {
            path: 'assets/projects/dicechess/'
        }
    },
    {
        id: 'shelter',
        name: 'Shelter',
        type: 'project',
        role: 'Lead Digital Artist, Designer, Partner',
        year: '14 Mar 2022',
        description: 'A small startup among friends that unexpectedly grew to over 1 million downloads on Google Play and a community of more than 60,000 users on Discord.',
        headerImage: 'assets/projects/shelter/header.webp',
        links: [
            {
                url: 'https://apps.apple.com/lv/app/shelter/id1530665345',
                icon: 'assets/icons/app-store.svg'
            },
            {
                url: 'https://discord.com/invite/szhtm2ct3y',
                icon: 'assets/icons/discord.svg'
            },
            {
                url: 'https://play.google.com/store/apps/details?id=com.VertexoGames.Shelter&hl=en',
                icon: 'assets/icons/play-market.svg'
            }
        ],
        gallery: {
            path: 'assets/projects/shelter/'
        }
    },
    // Game Jams
    {
        id: 'all-in-one',
        name: 'All in One',
        type: 'gamejam',
        role: 'Pixel artist',
        year: 'Dec 14, 2023',
        description: 'The latest and most memorable game jam entry, made for the theme "MODE." Left a lasting impression and brought a lot of new experience.',
        headerImage: 'assets/projects/jams/all-in-one/header.webp',
        links: [
            {
                url: 'https://rhum.itch.io/all-in-one',
                icon: 'assets/icons/itch-io.svg'
            }
        ],
        gallery: {
            path: 'assets/projects/jams/all-in-one/'
        }
    },
    {
        id: 'king-pin',
        name: 'King Pin',
        type: 'gamejam',
        role: 'Pixel artist, Music/SFX',
        year: 'Jul 09, 2023',
        description: 'An entry for the GMTK Game Jam 2023. Theme: "Roles Reversed."',
        headerImage: 'assets/projects/jams/king-pin/header.webp',
        links: [
            {
                url: 'https://wapi.itch.io/kingpin',
                icon: 'assets/icons/itch-io.svg'
            }
        ],
        gallery: {
            path: 'assets/projects/jams/king-pin/'
        }
    },
    {
        id: 'dr-boo',
        name: 'Dr. Boo',
        type: 'gamejam',
        role: 'Pixel artist, Music/SFX',
        year: 'Apr 24, 2023',
        description: 'First completed project using 3D graphics. Theme: "Take a Deep Breath."',
        headerImage: 'assets/projects/jams/dr-boo/header.webp',
        links: [
            {
                url: 'https://wapi.itch.io/drboo',
                icon: 'assets/icons/itch-io.svg'
            }
        ],
        gallery: {
            path: 'assets/projects/jams/dr-boo/'
        }
    },
    {
        id: 'funkin',
        name: 'Funkin\' (In Space)',
        type: 'gamejam',
        role: 'Pixel artist',
        year: 'May 30, 2022',
        description: 'A score-based rhythm game about an alien orchestra, made for the theme "Gravity is Under Your Control."',
        headerImage: 'assets/projects/jams/funkin/header.webp',
        links: [
            {
                url: 'https://maksimovmaksimilian.itch.io/funkin-in-space',
                icon: 'assets/icons/itch-io.svg'
            }
        ],
        gallery: {
            path: 'assets/projects/jams/funkin/'
        }
    },
    {
        id: 'r0000m',
        name: 'R00:00M',
        type: 'gamejam',
        role: 'Pixel artist, Music/SFX',
        year: 'Jul 12, 2021',
        description: 'First game jam experience made for the theme "One Room." The project that sparked my interest in creating games under tight deadlines.',
        headerImage: 'assets/projects/jams/r0000m/header.webp',
        links: [
            {
                url: 'https://retr0grape.itch.io/r0000m',
                icon: 'assets/icons/itch-io.svg'
            }
        ],
        gallery: {
            path: 'assets/projects/jams/r0000m/'
        }
    },
];

const projectConfig = {};
projectsData.forEach(project => {
    projectConfig[project.id] = project.gallery;
});


function generateProjectHTML(project) {
    const linksHTML = project.links.map(link => 
        `<a href="${link.url}" target="_blank"><img src="${link.icon}" class="project-icon"></a>`
    ).join('');
    
    const roleHTML = project.role ? `<h3 class="h3-accent-1">${project.role}</h3>` : '';
    const yearHTML = project.year ? `<h3 class="h3-accent-2">${project.year}</h3>` : '';
    
    return `
        <div class="container container-project">
            <div>
                <img class="header-image" src="${project.headerImage}" class="project-header-image">
            </div>
            <div>
                <h2>${project.name} ${linksHTML}</h2>
                ${roleHTML}
                ${yearHTML}
                <p>${project.description}</p>
            </div>
            <div class="gallery-grid" id="${project.id}-gallery"></div>
            <div class="expand-indicator"></div>
        </div>
    `;
}

function renderProjects() {
    const projectsContainer = document.getElementById('projects-container');
    const gameJamsContainer = document.getElementById('game-jams-container');
    
    if (!projectsContainer || !gameJamsContainer) return;
    
    const regularProjects = projectsData.filter(project => project.type === 'project');
    const gameJams = projectsData.filter(project => project.type === 'gamejam');
    
    projectsContainer.innerHTML = regularProjects.map(project => generateProjectHTML(project)).join('');
    
    gameJamsContainer.innerHTML = gameJams.map(project => generateProjectHTML(project)).join('');
}

// Asset data cache
let assetsData = null;
const VIDEO_EXTENSIONS = ['mp4', 'mov', 'mkv', 'webm', 'avi'];

// Function to load assets from JSON file
async function loadAssetsData() {
    if (assetsData) {
        return assetsData;
    }
    
    try {
        const response = await fetch('assets.json');
        if (response.ok) {
            assetsData = await response.json();
            return assetsData;
        } else {
            return {};
        }
    } catch (error) {
        console.error('Error loading assets data:', error);
        return {};
    }
}

// Function to scan directory and get assets (fallback for local development)
async function scanDirectory(folderPath) {
    try {
        const response = await fetch(folderPath);
        if (!response.ok) {
            throw new Error(`Could not access ${folderPath}`);
        }
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a[href]');
        
        const assets = [];
        const supportedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.mp4', '.mov', '.webm', '.avi', '.mkv'];
        
        links.forEach(link => {
            const fileName = link.getAttribute('href');
            if (fileName && fileName !== '../' && fileName !== './') {
                const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
                if (supportedExtensions.includes(ext)) {
                    assets.push(fileName);
                }
            }
        });
        
        // Sort assets by number in filename
        assets.sort((a, b) => {
            const aNum = parseInt(a.match(/\d+/)?.[0] || '999');
            const bNum = parseInt(b.match(/\d+/)?.[0] || '999');
            return aNum - bNum;
        });
        
        return assets;
        
    } catch (error) {
        console.error(`Error scanning directory ${folderPath}:`, error);
        return [];
    }
}

// Function to get assets for a project
async function discoverAssets(projectName) {
    // First try to get from JSON file (works on GitHub Pages)
    const assets = await loadAssetsData();
    const projectFolder = projectName;
    
    if (assets[projectFolder] && assets[projectFolder].length > 0) {
        return assets[projectFolder];
    }
    
    return [];
}

// Function to get assets for Art page
async function discoverArtAssets() {
    // First try to get from JSON file (works on GitHub Pages)
    const assets = await loadAssetsData();
    
    if (assets['personal-art'] && assets['personal-art'].length > 0) {
        return assets['personal-art'];
    }
    
    return [];
}

function buildAssetUrl(assetPath, fileName) {
    return assetPath + fileName;
}

function isVideoFile(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    return VIDEO_EXTENSIONS.includes(extension);
}

// Single source of truth for the dual-shape assets.json schema.
// Accepts either a legacy bare-string filename ("1.gif") or the new
// { full, thumb, type } object emitted by asset-optimizer / asset-manager.
// Always returns { full, thumb, type }. For legacy entries `thumb` falls
// back to `full` so the grid still renders something while migration runs.
function normalizeAssetEntry(entry) {
    if (entry && typeof entry === 'object') {
        const full = entry.full;
        const thumb = entry.thumb || entry.full;
        const type = entry.type || (isVideoFile(full) ? 'video' : 'image');
        return { full, thumb, type };
    }
    // Legacy: bare filename string.
    const fileName = entry;
    return {
        full: fileName,
        thumb: fileName,
        type: isVideoFile(fileName) ? 'video' : 'image'
    };
}

function startGalleryVideo(video) {
    video.muted = true;
    video.defaultMuted = true;
    video.load();
    video.play().catch(() => {});
}

function unloadGallery(gallery) {
    if (!gallery) return;

    gallery.querySelectorAll('video.gallery-asset').forEach(video => {
        video.pause();
        video.removeAttribute('src');
        video.innerHTML = '';
        video.load();
    });

    gallery.querySelectorAll('img.gallery-asset').forEach(img => {
        img.removeAttribute('src');
    });

    gallery.innerHTML = '';
    gallery.removeAttribute('data-assets');
    gallery.removeAttribute('data-asset-path');
}

function unloadAllProjectGalleries() {
    document.querySelectorAll('.container-project .gallery-grid').forEach(unloadGallery);
}

function createGalleryItem(assetPath, entry, assetIndex) {
    const { full, thumb, type } = normalizeAssetEntry(entry);
    const thumbPath = buildAssetUrl(assetPath, thumb);
    const fullPath = buildAssetUrl(assetPath, full);
    const isVideo = type === 'video';

    if (isVideo) {
        const video = document.createElement('video');
        video.className = 'gallery-asset';
        video.controls = true;
        video.muted = true;
        video.defaultMuted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        // Grid videos: only fetch metadata, source points at the lightweight thumb.
        video.preload = 'metadata';
        video.style.cursor = 'pointer';
        video.src = thumbPath;
        startGalleryVideo(video);

        video.addEventListener('click', function(e) {
            e.stopPropagation();
            const gallery = video.closest('.gallery-grid');
            const assets = JSON.parse(gallery.getAttribute('data-assets') || '[]');
            const galleryAssetPath = gallery.getAttribute('data-asset-path') || '';
            // Lightbox always opens the full-quality source.
            openLightbox(fullPath, true, assets, assetIndex, galleryAssetPath);
        });

        return video;
    }

    const img = document.createElement('img');
    img.alt = full;
    img.className = 'gallery-asset';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.style.cursor = 'pointer';
    img.src = thumbPath;

    img.addEventListener('click', function(e) {
        e.stopPropagation();
        const gallery = img.closest('.gallery-grid');
        const assets = JSON.parse(gallery.getAttribute('data-assets') || '[]');
        const galleryAssetPath = gallery.getAttribute('data-asset-path') || '';
        // Lightbox always opens the full-quality source.
        openLightbox(fullPath, false, assets, assetIndex, galleryAssetPath);
    });

    return img;
}

async function populateGallery(projectName) {
    const gallery = document.getElementById(`${projectName}-gallery`);
    if (!gallery) return;
    
    try {
        const assets = await discoverAssets(projectName);
        
        if (assets.length === 0) {
            gallery.innerHTML = '<div class="no-assets">No assets found</div>';
            return;
        }
        
        const project = projectConfig[projectName];
        gallery.innerHTML = '';
        fillColumnsWithAssets(gallery, assets, project.path);
        
    } catch (error) {
        console.error(`Error loading gallery for ${projectName}:`, error);
        gallery.innerHTML = '<div class="error-state">Error loading gallery</div>';
    }
}

async function populateArtGallery() {
    const gallery = document.getElementById('art-gallery');
    if (!gallery) return;
    
    try {
        const assets = await discoverArtAssets();
        
        if (assets.length === 0) {
            gallery.innerHTML = '<div class="no-assets">No art assets found</div>';
            return;
        }
        
        gallery.innerHTML = '';
        fillColumnsWithAssets(gallery, assets, 'assets/personal-art/');
        
    } catch (error) {
        console.error(`Error loading art gallery:`, error);
        gallery.innerHTML = '<div class="error-state">Error loading art gallery</div>';
    }
}

// Function to get current breakpoint
function getCurrentBreakpoint() {
    if (window.innerWidth <= 900) return 'small';
    if (window.innerWidth <= 1300) return 'medium';
    return 'large';
}

// Function to get column count for breakpoint
function getColumnCount(breakpoint) {
    switch(breakpoint) {
        case 'small': return 2;
        default: return 3;
    }
}

// Function to fill columns with assets (fill first places of all columns first)
function fillColumnsWithAssets(gallery, assets, assetPath) {
    // Store assets data for potential re-distribution
    gallery.setAttribute('data-assets', JSON.stringify(assets));
    gallery.setAttribute('data-asset-path', assetPath);
    gallery.setAttribute('data-current-breakpoint', getCurrentBreakpoint());
    
    // Initial distribution
    distributeAssets(gallery);
    
    // Add efficient resize listener (only triggers on breakpoint change)
    if (!gallery.hasAttribute('data-resize-listener')) {
        let currentBreakpoint = getCurrentBreakpoint();
        
        const resizeHandler = () => {
            if (gallery.classList.contains('gallery-hidden')) {
                return;
            }
            const newBreakpoint = getCurrentBreakpoint();
            if (newBreakpoint !== currentBreakpoint) {
                currentBreakpoint = newBreakpoint;
                distributeAssets(gallery);
            }
        };
        
        window.addEventListener('resize', resizeHandler);
        gallery.setAttribute('data-resize-listener', 'true');
    }
}

// Function to distribute assets (only called when breakpoint changes)
function distributeAssets(gallery) {
    const assets = JSON.parse(gallery.getAttribute('data-assets') || '[]');
    const assetPath = gallery.getAttribute('data-asset-path') || '';
    const breakpoint = getCurrentBreakpoint();
    const columnCount = getColumnCount(breakpoint);
    
    if (assets.length === 0) return;
    
    gallery.innerHTML = '';
    
    // Create columns
    for (let i = 0; i < columnCount; i++) {
        const column = document.createElement('div');
        column.className = 'gallery-column';
        gallery.appendChild(column);
    }
    
    const columns = gallery.querySelectorAll('.gallery-column');
    assets.forEach((entry, index) => {
        const columnIndex = index % columnCount;
        const item = createGalleryItem(assetPath, entry, index);
        columns[columnIndex].appendChild(item);
    });
}

// Page navigation functionality
function showPage(pageId) {
    // Hide all pages
    const allPages = document.querySelectorAll('.page-content');
    allPages.forEach(page => {
        page.style.display = 'none';
    });
    
    // Show the selected page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.style.display = 'block';
    }
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-page="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Scroll to top of the page
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    const artGallery = document.getElementById('art-gallery');
    
    if (pageId === 'art') {
        unloadAllProjectGalleries();
        document.querySelectorAll('.container-project').forEach(container => {
            container.classList.remove('expanded');
            container.querySelector('.gallery-grid')?.classList.add('gallery-hidden');
        });
        populateArtGallery();
    } else if (artGallery) {
        unloadGallery(artGallery);
    }
}   

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            showPage(pageId);
            
            // Close mobile menu if open
            const navLinksContainer = document.querySelector('.nav-links');
            if (navLinksContainer) {
                navLinksContainer.classList.remove('mobile-open');
            }
        });
        
        // Make nav links clickable
        link.style.cursor = 'pointer';
    });
    
    // Setup home link functionality
    const homeLink = document.getElementById('home-link');
    if (homeLink) {
        homeLink.addEventListener('click', function() {
            window.location.reload();
        });
    }
    
    // Setup mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinksContainer) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinksContainer.classList.toggle('mobile-open');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navLinksContainer.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navLinksContainer.classList.remove('mobile-open');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadAssetsData();
    setupNavigation();
    showPage('projects');
    renderProjects();
    setupProjectContainers();
    setupLightbox();
});

function getProjectNameFromContainer(container) {
    const gallery = container.querySelector('.gallery-grid');
    if (gallery && gallery.id) {
        return gallery.id.replace('-gallery', '');
    }
    return null;
}

function setupProjectContainers() {
    const projectContainers = document.querySelectorAll('.container-project');
    
    projectContainers.forEach(container => {
        const gallery = container.querySelector('.gallery-grid');
        if (!gallery) return;
        
        gallery.classList.add('gallery-hidden');
        
        let isMouseOverGallery = false;
        
        gallery.addEventListener('mouseenter', function() {
            isMouseOverGallery = true;
        });
        
        gallery.addEventListener('mouseleave', function() {
            isMouseOverGallery = false;
        });

        container.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.tagName === 'IMG') {
                return;
            }
            
            if (isMouseOverGallery) {
                return;
            }
            
            const isVisible = gallery.classList.contains('gallery-hidden');
            if (isVisible) {
                const projectName = getProjectNameFromContainer(container);
                
                unloadGallery(document.getElementById('art-gallery'));
                
                projectContainers.forEach(otherContainer => {
                    if (otherContainer !== container) {
                        const otherGallery = otherContainer.querySelector('.gallery-grid');
                        if (otherGallery) {
                            otherGallery.classList.add('gallery-hidden');
                            unloadGallery(otherGallery);
                        }
                        otherContainer.classList.remove('expanded');
                    }
                });
                
                gallery.classList.remove('gallery-hidden');
                container.classList.add('expanded');

                if (projectName) {
                    populateGallery(projectName);
                }
                
                setTimeout(() => {
                    const headerHeight = document.querySelector('.container-header')?.offsetHeight || 0;
                    const containerTop = container.offsetTop;
                    const scrollPosition = containerTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: scrollPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            } else {
                gallery.classList.add('gallery-hidden');
                unloadGallery(gallery);
                container.classList.remove('expanded');
            }
        });
        
        container.classList.add('clickable');
    });
}

// Lightbox functionality
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let currentScale = 1;
let currentTranslateX = 0;
let currentTranslateY = 0;
let clickTimeout = null;
let currentAssetIndex = 0;
let currentAssets = [];
let currentAssetPath = '';

function openLightbox(src, isVideo = false, assets = [], assetIndex = 0, assetPath = '') {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxVideo = document.getElementById('lightbox-video');
    
    // Store current context
    currentAssets = assets;
    currentAssetIndex = assetIndex;
    currentAssetPath = assetPath;
    
    if (isVideo) {
        lightboxImage.style.display = 'none';
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = src;
        lightboxVideo.load();
        // Autoplay video in lightbox
        lightboxVideo.play().catch(e => {
            console.log('Autoplay prevented:', e);
        });
    } else {
        lightboxVideo.style.display = 'none';
        lightboxImage.style.display = 'block';
        lightboxImage.src = src;
    }
    
    // Reset transform
    currentScale = 1;
    currentTranslateX = 0;
    currentTranslateY = 0;
    updateTransform(lightboxImage);
    updateTransform(lightboxVideo);
    
    // Update navigation buttons visibility
    updateNavigationButtons();
    
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxVideo = document.getElementById('lightbox-video');
    
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');
    lightboxVideo.load();
    lightboxImage.removeAttribute('src');
    
    currentScale = 1;
    currentTranslateX = 0;
    currentTranslateY = 0;
    updateTransform(lightboxImage);
    updateTransform(lightboxVideo);
}

function updateNavigationButtons() {
    const prevButton = document.getElementById('lightbox-prev');
    const nextButton = document.getElementById('lightbox-next');
    
    if (currentAssets.length <= 1) {
        prevButton.style.display = 'none';
        nextButton.style.display = 'none';
        return;
    }
    
    prevButton.style.display = 'block';
    nextButton.style.display = 'block';
    
    // Disable buttons at boundaries
    prevButton.disabled = currentAssetIndex === 0;
    nextButton.disabled = currentAssetIndex === currentAssets.length - 1;
}

function navigateToAsset(direction) {
    if (currentAssets.length <= 1) return;
    
    let newIndex = currentAssetIndex;
    if (direction === 'prev' && currentAssetIndex > 0) {
        newIndex = currentAssetIndex - 1;
    } else if (direction === 'next' && currentAssetIndex < currentAssets.length - 1) {
        newIndex = currentAssetIndex + 1;
    } else {
        return; // Can't navigate further
    }
    
    const { full, type } = normalizeAssetEntry(currentAssets[newIndex]);
    const isVideo = type === 'video';
    const fullPath = buildAssetUrl(currentAssetPath, full);

    // Update current index
    currentAssetIndex = newIndex;
    
    // Load new asset
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxVideo = document.getElementById('lightbox-video');
    
    if (isVideo) {
        lightboxImage.style.display = 'none';
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = fullPath;
        lightboxVideo.load();
        // Autoplay video when navigating
        lightboxVideo.play().catch(e => {
            console.log('Autoplay prevented:', e);
        });
    } else {
        lightboxVideo.style.display = 'none';
        lightboxImage.style.display = 'block';
        lightboxImage.src = fullPath;
    }
    
    // Reset transform for new asset
    currentScale = 1;
    currentTranslateX = 0;
    currentTranslateY = 0;
    updateTransform(lightboxImage);
    updateTransform(lightboxVideo);
    
    // Update navigation buttons
    updateNavigationButtons();
}

function updateTransform(element) {
    element.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(${currentScale})`;
    
    // Add/remove zoomed class for cursor styling
    if (currentScale > 1) {
        element.classList.add('zoomed');
    } else {
        element.classList.remove('zoomed');
    }
}


function handleLightboxMouseDown(e) {
    if (currentScale <= 1) return;
    
    isDragging = false;
    dragStartX = e.clientX - currentTranslateX;
    dragStartY = e.clientY - currentTranslateY;
    
    // Set a timeout to detect if this becomes a drag
    clickTimeout = setTimeout(() => {
        isDragging = true;
    }, 100); // 100ms delay before considering it a drag
    
    e.preventDefault();
}

function handleLightboxMouseMove(e) {
    if (!isDragging || currentScale <= 1) return;
    
    currentTranslateX = e.clientX - dragStartX;
    currentTranslateY = e.clientY - dragStartY;
    
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxVideo = document.getElementById('lightbox-video');
    updateTransform(lightboxImage);
    updateTransform(lightboxVideo);
}

function handleLightboxMouseUp() {
    // Clear the click timeout
    if (clickTimeout) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
    }
    
    // Reset dragging after a short delay to prevent click from firing
    setTimeout(() => {
        isDragging = false;
    }, 50);
}

function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.querySelector('.lightbox-content');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxVideo = document.getElementById('lightbox-video');
    const closeButton = document.querySelector('.lightbox-close');
    const prevButton = document.getElementById('lightbox-prev');
    const nextButton = document.getElementById('lightbox-next');
    
    // Event listeners
    lightbox.addEventListener('click', function(e) {
        // Only close if clicking directly on the lightbox background
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Also handle clicks on the asset container (empty space around assets)
    const assetContainer = document.querySelector('.lightbox-asset-container');
    assetContainer.addEventListener('click', function(e) {
        // Close if clicking on asset container but not on assets
        if (e.target === assetContainer) {
            closeLightbox();
        }
    });
    
    closeButton.addEventListener('click', closeLightbox);
    
    // Navigation buttons
    prevButton.addEventListener('click', function(e) {
        e.stopPropagation();
        navigateToAsset('prev');
    });
    
    nextButton.addEventListener('click', function(e) {
        e.stopPropagation();
        navigateToAsset('next');
    });
    
    // Asset click handlers for zoom (only for images)
    lightboxImage.addEventListener('click', function(e) {
        e.stopPropagation();
        // Only zoom if it wasn't a drag operation
        if (!isDragging) {
            if (currentScale === 1) {
                currentScale = 2;
                // Zoom branch: lightbox already shows the `full` webp (highest tier we ship).
                // If we ever add a higher-resolution tier (e.g. `original`), swap lightboxImage.src here.
            } else {
                currentScale = 1;
                currentTranslateX = 0;
                currentTranslateY = 0;
            }
            updateTransform(lightboxImage);
            updateTransform(lightboxVideo);
        }
    });
    
    // Video click handler (no zoom, just prevent closing lightbox)
    lightboxVideo.addEventListener('click', function(e) {
        e.stopPropagation();
        // Videos don't zoom, just prevent lightbox from closing
    });
    
    // Drag functionality (only for images)
    lightboxImage.addEventListener('mousedown', handleLightboxMouseDown);
    
    document.addEventListener('mousemove', handleLightboxMouseMove);
    document.addEventListener('mouseup', handleLightboxMouseUp);
    
    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'block') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateToAsset('prev');
            } else if (e.key === 'ArrowRight') {
                navigateToAsset('next');
            }
        }
    });
}
