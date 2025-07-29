document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const quoteText = document.getElementById('quote-text');
    const quoteContent = document.getElementById('quote-content');
    const authorContent = document.getElementById('author-content');
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');
    const removeImageBtn = document.getElementById('remove-image');
    const fileNameDisplay = document.getElementById('file-name');
    
    // Control Elements
    const textColor = document.getElementById('text-color');
    const bgOpacity = document.getElementById('bg-opacity');
    const fontFamily = document.getElementById('font-family');
    const fontSize = document.getElementById('font-size');
    const textShadow = document.getElementById('text-shadow');
    const alignButtons = document.querySelectorAll('.align-btn');
    const presetButtons = document.querySelectorAll('.preset-btn');
    
    // Default values
    let currentImage = null;
    let currentAlignment = 'center';
    
    // Initialize the app
    function init() {
        updateTextStyles();
        setupEventListeners();
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        // Image upload handling
        imageUpload.addEventListener('change', handleImageUpload);
        removeImageBtn.addEventListener('click', removeBackgroundImage);
        
        // Text content handling
        quoteContent.addEventListener('input', updateQuoteText);
        authorContent.addEventListener('input', updateAuthorText);
        
        // Style controls
        textColor.addEventListener('input', updateTextStyles);
        bgOpacity.addEventListener('input', updateBackgroundOverlay);
        fontFamily.addEventListener('change', updateTextStyles);
        fontSize.addEventListener('input', updateTextStyles);
        textShadow.addEventListener('input', updateTextStyles);
        
        // Alignment buttons
        alignButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                setAlignment(this.dataset.align);
            });
        });
        
        // Preset buttons
        presetButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                applyPreset(this.dataset.preset);
            });
        });
        
        // Download button
        downloadBtn.addEventListener('click', downloadImage);
        
        // Share button (placeholder for future functionality)
        shareBtn.addEventListener('click', function() {
            alert('Share functionality will be added in a future update!');
        });
    }
    
    // Handle image upload
    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            currentImage = file;
            fileNameDisplay.textContent = file.name;
            removeImageBtn.disabled = false;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                imagePreview.style.backgroundImage = `url('${event.target.result}')`;
                imagePreview.dataset.imageLoaded = 'true';
            };
            reader.readAsDataURL(file);
        }
    }
    
    // Remove background image
    function removeBackgroundImage() {
        imagePreview.style.backgroundImage = 'none';
        imagePreview.dataset.imageLoaded = 'false';
        currentImage = null;
        fileNameDisplay.textContent = 'No file selected';
        removeImageBtn.disabled = true;
    }
    
    // Update quote text
    function updateQuoteText() {
        quoteText.textContent = quoteContent.value || 'Type your inspirational quote here...';
    }
    
    // Update author text
    function updateAuthorText() {
        quoteText.dataset.author = authorContent.value ? `— ${authorContent.value}` : '';
    }
    
    // Update all text styles
    function updateTextStyles() {
        quoteText.style.color = textColor.value;
        quoteText.style.fontFamily = fontFamily.value;
        quoteText.style.fontSize = `${fontSize.value}px`;
        quoteText.style.textShadow = `0 ${textShadow.value}px ${textShadow.value * 1.5}px rgba(0, 0, 0, 0.5)`;
        quoteText.style.textAlign = currentAlignment;
    }
    
    // Update background overlay
    function updateBackgroundOverlay() {
        const opacity = bgOpacity.value / 100;
        imagePreview.style.setProperty('--overlay-opacity', opacity);
    }
    
    // Set text alignment
    function setAlignment(alignment) {
        currentAlignment = alignment;
        quoteText.style.textAlign = alignment;
        
        // Update active state of alignment buttons
        alignButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.align === alignment);
        });
    }
    
    // Apply preset styles
    function applyPreset(preset) {
        switch(preset) {
            case 'light':
                textColor.value = '#ffffff';
                bgOpacity.value = 40;
                fontFamily.value = "'Playfair Display', serif";
                textShadow.value = 4;
                break;
            case 'dark':
                textColor.value = '#212529';
                bgOpacity.value = 10;
                fontFamily.value = "'Montserrat', sans-serif";
                textShadow.value = 1;
                break;
            case 'modern':
                textColor.value = '#ffffff';
                bgOpacity.value = 70;
                fontFamily.value = "'Montserrat', sans-serif";
                textShadow.value = 2;
                fontSize.value = 28;
                break;
        }
        
        updateTextStyles();
        updateBackgroundOverlay();
    }
    
    // Download the generated image
    function downloadImage() {
        if (!imagePreview.dataset.imageLoaded || imagePreview.dataset.imageLoaded === 'false') {
            alert('Please upload a background image first!');
            return;
        }
        
        // Show loading state
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Generating...';
        
        // Create a temporary clone for better rendering
        const clone = imagePreview.cloneNode(true);
        clone.style.width = '1200px';
        clone.style.height = '630px'; // Ideal for social media
        clone.style.padding = '0';
        clone.style.margin = '0';
        document.body.appendChild(clone);
        
        // Use html2canvas to capture the image
        html2canvas(clone, {
            backgroundColor: null,
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true
        }).then(canvas => {
            // Create download link
            const link = document.createElement('a');
            link.download = `quote-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Remove clone
            document.body.removeChild(clone);
            
            // Reset button state
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Download Image';
        }).catch(err => {
            console.error('Error generating image:', err);
            alert('Error generating image. Please try again.');
            
            // Remove clone if error occurs
            document.body.removeChild(clone);
            
            // Reset button state
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Download Image';
        });
    }
    
    // Initialize the application
    init();
});