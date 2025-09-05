const projectsData = [
    {
        id: 'ether',
        name: 'Ether',
        type: 'project',
        role: 'Digital/Pixel artist',
        year: '15 Aug, 2024',
        description: 'Description of the project',
        headerImage: 'assets/projects/ether/header.png',
        links: [
            {
                url: 'https://store.steampowered.com/app/3107730/Ether/',
                icon: 'assets/icons/steam.ico'
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
        description: 'Description of the project',
        headerImage: 'assets/projects/dicechess/header.png',
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
        role: 'Digital artist, Designer',
        year: '14 Mar 2022',
        description: 'Description of the project',
        headerImage: 'assets/projects/shelter/header.png',
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
        description: 'A game jam project',
        headerImage: 'assets/projects/jams/all-in-one/header.gif',
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
        id: 'kingpin',
        name: 'King Pin',
        type: 'gamejam',
        role: 'Pixel artist, Music/SFX',
        year: 'Jul 09, 2023',
        description: 'A game jam project',
        headerImage: 'assets/projects/jams/king-pin/header.png',
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
        description: 'A game jam project',
        headerImage: 'assets/projects/jams/dr-boo/header.gif',
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
        description: 'A spooky game jam project',
        headerImage: 'assets/projects/jams/funkin/header.gif',
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
        description: 'A spooky game jam project',
        headerImage: 'assets/projects/jams/r0000m/header.png',
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

// Function to scan directory and get assets
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
    const project = projectConfig[projectName];
    const projectPath = project.path;
    
    return await scanDirectory(projectPath);
}

// Function to get assets for Art page
async function discoverArtAssets() {
    return await scanDirectory('assets/personal-art/');
}

// Function to create gallery item
function createGalleryItem(assetPath, fileName) {
    const fileExtension = fileName.split('.').pop().toLowerCase();
    const fullPath = assetPath + fileName;
    
    if (['mp4', 'mov', 'mkv'].includes(fileExtension)) {
        const video = document.createElement('video');
        video.src = fullPath;
        video.controls = true;
        video.muted = true;
        video.preload = 'metadata';
        video.autoplay = true;
        video.loop = true;
        video.className = 'gallery-asset';
        video.style.cursor = 'pointer';
        
        // Add click handler for lightbox
        video.addEventListener('click', function(e) {
            e.stopPropagation();
            // Get the gallery and its assets
            const gallery = video.closest('.gallery-grid');
            const assets = JSON.parse(gallery.getAttribute('data-assets') || '[]');
            const assetPath = gallery.getAttribute('data-asset-path') || '';
            const assetIndex = assets.indexOf(fileName);
            openLightbox(fullPath, true, assets, assetIndex, assetPath);
        });
        
        // Add error handling
        video.onerror = function() {
            console.error(`Failed to load video: ${fullPath}`);
        };
        
        return video;
    } else {
        const img = document.createElement('img');
        img.src = fullPath;
        img.alt = fileName;
        img.loading = 'lazy';
        img.className = 'gallery-asset';
        img.style.cursor = 'pointer';
        
        // Add click handler for lightbox
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            // Get the gallery and its assets
            const gallery = img.closest('.gallery-grid');
            const assets = JSON.parse(gallery.getAttribute('data-assets') || '[]');
            const assetPath = gallery.getAttribute('data-asset-path') || '';
            const assetIndex = assets.indexOf(fileName);
            openLightbox(fullPath, false, assets, assetIndex, assetPath);
        });
        
        // Add error handling
        img.onerror = function() {
            console.error(`Failed to load image: ${fullPath}`);
        };
        
        return img;
    }
}

async function populateGallery(projectName) {
    const gallery = document.getElementById(`${projectName}-gallery`);
    if (!gallery) return;
    
    gallery.innerHTML = '<div class="loading-state">Loading gallery...</div>';
    
    try {
        const assets = await discoverAssets(projectName);
        
        if (assets.length === 0) {
            gallery.innerHTML = '<div class="no-assets">No assets found</div>';
            return;
        }
        
        gallery.innerHTML = '';
        
        // Add discovered assets to gallery with column-filling logic
        const project = projectConfig[projectName];
        fillColumnsWithAssets(gallery, assets, project.path);
        
    } catch (error) {
        console.error(`Error loading gallery for ${projectName}:`, error);
        gallery.innerHTML = '<div class="error-state">Error loading gallery</div>';
    }
}

async function populateArtGallery() {
    const gallery = document.getElementById('art-gallery');
    if (!gallery) return;
    
    gallery.innerHTML = '<div class="loading-state">Loading art gallery...</div>';
    
    try {
        const assets = await discoverArtAssets();
        
        if (assets.length === 0) {
            gallery.innerHTML = '<div class="no-assets">No art assets found</div>';
            return;
        }
        
        gallery.innerHTML = '';
        
        // Use the same column-filling logic as projects
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
    
    // Clear existing columns
    gallery.innerHTML = '';
    
    // Create columns
    for (let i = 0; i < columnCount; i++) {
        const column = document.createElement('div');
        column.className = 'gallery-column';
        gallery.appendChild(column);
    }
    
    // Fill columns: asset 1 goes to column 1, asset 2 to column 2, etc.
    const columns = gallery.querySelectorAll('.gallery-column');
    assets.forEach((fileName, index) => {
        const columnIndex = index % columnCount;
        
        const item = createGalleryItem(assetPath, fileName);
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
    
    // Load art gallery when art page is shown
    if (pageId === 'art') {
        populateArtGallery();
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            showPage(pageId);
        });
        
        // Make nav links clickable
        link.style.cursor = 'pointer';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Setup navigation first
    setupNavigation();
    
    // Show projects page by default
    showPage('projects');

    renderProjects();
    
    // Only populate the first gallery initially
    const firstProjectName = Object.keys(projectConfig)[0];
    populateGallery(firstProjectName);
    
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
        
        if (container === projectContainers[0]) {
            gallery.classList.remove('gallery-hidden');
            container.classList.add('expanded');
        }
        
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
            
            projectContainers.forEach(otherContainer => {
                if (otherContainer !== container) {
                    const otherGallery = otherContainer.querySelector('.gallery-grid');
                    if (otherGallery) {
                        otherGallery.classList.add('gallery-hidden');
                    }
                    otherContainer.classList.remove('expanded');
                }
            });
            
            const isVisible = gallery.classList.contains('gallery-hidden');
            if (isVisible) {
                const projectName = getProjectNameFromContainer(container);
                if (projectName && !gallery.hasAttribute('data-loaded')) {
                    populateGallery(projectName);
                    gallery.setAttribute('data-loaded', 'true');
                }
                gallery.classList.remove('gallery-hidden');
                container.classList.add('expanded');
                
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
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset transform
    currentScale = 1;
    currentTranslateX = 0;
    currentTranslateY = 0;
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxVideo = document.getElementById('lightbox-video');
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
    
    const fileName = currentAssets[newIndex];
    const fileExtension = fileName.split('.').pop().toLowerCase();
    const isVideo = ['mp4', 'mov', 'mkv'].includes(fileExtension);
    const fullPath = currentAssetPath + fileName;
    
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
