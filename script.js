document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        imageUpload: document.getElementById('image-upload'),
        imagePreview: document.getElementById('image-preview'),
        quoteText: document.getElementById('quote-text'),
        quoteContent: document.getElementById('quote-content'),
        authorContent: document.getElementById('author-content'),
        downloadBtn: document.getElementById('download-btn'),
        clearBtn: document.getElementById('clear-btn'),
        removeImageBtn: document.getElementById('remove-image'),
        fileNameDisplay: document.getElementById('file-name'),
        textColor: document.getElementById('text-color'),
        bgColor: document.getElementById('bg-color'),
        bgOpacity: document.getElementById('bg-opacity'),
        fontFamily: document.getElementById('font-family'),
        fontSize: document.getElementById('font-size'),
        textShadow: document.getElementById('text-shadow'),
        textPadding: document.getElementById('text-padding'),
        alignButtons: document.querySelectorAll('.align-btn'),
        presetButtons: document.querySelectorAll('.preset-btn')
    };

    // App State
    const state = {
        currentImage: null,
        currentAlignment: 'center',
        overlayColor: '#000000'
    };

    // Initialize the app
    function init() {
        setupEventListeners();
        updateTextStyles();
        updateBackgroundOverlay();
    }

    // Set up all event listeners
    function setupEventListeners() {
        // Image upload handling
        elements.imageUpload.addEventListener('change', handleImageUpload);
        elements.removeImageBtn.addEventListener('click', removeBackgroundImage);
        
        // Text content handling
        elements.quoteContent.addEventListener('input', updateQuoteText);
        elements.authorContent.addEventListener('input', updateAuthorText);
        
        // Style controls
        elements.textColor.addEventListener('input', updateTextStyles);
        elements.bgColor.addEventListener('input', updateBackgroundOverlay);
        elements.bgOpacity.addEventListener('input', updateBackgroundOverlay);
        elements.fontFamily.addEventListener('change', updateTextStyles);
        elements.fontSize.addEventListener('input', updateTextStyles);
        elements.textShadow.addEventListener('input', updateTextStyles);
        elements.textPadding.addEventListener('input', updateTextStyles);
        
        // Alignment buttons
        elements.alignButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                setAlignment(this.dataset.align);
            });
        });
        
        // Preset buttons
        elements.presetButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                applyPreset(this.dataset.preset);
            });
        });
        
        // Action buttons
        elements.downloadBtn.addEventListener('click', downloadImage);
        elements.clearBtn.addEventListener('click', resetAll);
    }

    // Handle image upload
    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            state.currentImage = file;
            elements.fileNameDisplay.textContent = file.name;
            elements.removeImageBtn.disabled = false;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                elements.imagePreview.style.backgroundImage = `url('${event.target.result}')`;
                elements.imagePreview.dataset.imageLoaded = 'true';
            };
            reader.readAsDataURL(file);
        }
    }

    // Remove background image
    function removeBackgroundImage() {
        elements.imagePreview.style.backgroundImage = 'none';
        elements.imagePreview.dataset.imageLoaded = 'false';
        state.currentImage = null;
        elements.fileNameDisplay.textContent = 'No file selected';
        elements.removeImageBtn.disabled = true;
        elements.imageUpload.value = '';
    }

    // Update quote text
    function updateQuoteText() {
        elements.quoteText.textContent = elements.quoteContent.value || 'Type your quote here...';
    }

    // Update author text
    function updateAuthorText() {
        elements.quoteText.dataset.author = elements.authorContent.value ? `— ${elements.authorContent.value}` : '';
    }

    // Update all text styles
    function updateTextStyles() {
        elements.quoteText.style.color = elements.textColor.value;
        elements.quoteText.style.fontFamily = elements.fontFamily.value;
        elements.quoteText.style.fontSize = `${elements.fontSize.value}px`;
        elements.quoteText.style.textShadow = `0 ${elements.textShadow.value}px ${elements.textShadow.value * 1.5}px rgba(0, 0, 0, 0.5)`;
        elements.quoteText.style.textAlign = state.currentAlignment;
        elements.quoteText.style.padding = `${elements.textPadding.value}px`;
    }

    // Update background overlay
    function updateBackgroundOverlay() {
        state.overlayColor = elements.bgColor.value;
        const opacity = elements.bgOpacity.value / 100;
        
        // Create the overlay with updated color and opacity
        elements.imagePreview.style.setProperty('--overlay-color', state.overlayColor);
        elements.imagePreview.style.setProperty('--overlay-opacity', opacity);
    }

    // Set text alignment
    function setAlignment(alignment) {
        state.currentAlignment = alignment;
        elements.quoteText.style.textAlign = alignment;
        
        // Update active state of alignment buttons
        elements.alignButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.align === alignment);
        });
    }

    // Apply preset styles
    function applyPreset(preset) {
        switch(preset) {
            case 'light':
                elements.textColor.value = '#ffffff';
                elements.bgColor.value = '#000000';
                elements.bgOpacity.value = 40;
                elements.fontFamily.value = "'Playfair Display', serif";
                elements.textShadow.value = 4;
                break;
            case 'dark':
                elements.textColor.value = '#2d3436';
                elements.bgColor.value = '#ffffff';
                elements.bgOpacity.value = 20;
                elements.fontFamily.value = "'Montserrat', sans-serif";
                elements.textShadow.value = 1;
                break;
            case 'vibrant':
                elements.textColor.value = '#ffffff';
                elements.bgColor.value = '#6c5ce7';
                elements.bgOpacity.value = 60;
                elements.fontFamily.value = "'Pacifico', cursive";
                elements.textShadow.value = 3;
                break;
            case 'pastel':
                elements.textColor.value = '#2d3436';
                elements.bgColor.value = '#a8e6cf';
                elements.bgOpacity.value = 50;
                elements.fontFamily.value = "'Montserrat', sans-serif";
                elements.textShadow.value = 2;
                break;
        }
        
        updateTextStyles();
        updateBackgroundOverlay();
    }

    // Reset all settings
    function resetAll() {
        // Reset form elements
        elements.quoteContent.value = '';
        elements.authorContent.value = '';
        elements.textColor.value = '#ffffff';
        elements.bgColor.value = '#000000';
        elements.bgOpacity.value = 40;
        elements.fontFamily.value = "'Playfair Display', serif";
        elements.fontSize.value = 32;
        elements.textShadow.value = 3;
        elements.textPadding.value = 40;
        
        // Reset image
        removeBackgroundImage();
        
        // Reset alignment
        setAlignment('center');
        
        // Update UI
        updateQuoteText();
        updateAuthorText();
        updateTextStyles();
        updateBackgroundOverlay();
    }

    // Download the generated image
    function downloadImage() {
        if (!elements.imagePreview.dataset.imageLoaded || elements.imagePreview.dataset.imageLoaded === 'false') {
            alert('Please upload a background image first!');
            return;
        }
        
        // Show loading state
        const originalBtnText = elements.downloadBtn.innerHTML;
        elements.downloadBtn.disabled = true;
        elements.downloadBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Generating...';
        
        // Create a temporary clone for better rendering
        const clone = elements.imagePreview.cloneNode(true);
        clone.style.width = '1200px';
        clone.style.height = '630px';
        clone.style.padding = '0';
        clone.style.margin = '0';
        clone.style.borderRadius = '0';
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
            elements.downloadBtn.disabled = false;
            elements.downloadBtn.innerHTML = originalBtnText;
        }).catch(err => {
            console.error('Error generating image:', err);
            alert('Error generating image. Please try again.');
            
            // Remove clone if error occurs
            document.body.removeChild(clone);
            
            // Reset button state
            elements.downloadBtn.disabled = false;
            elements.downloadBtn.innerHTML = originalBtnText;
        });
    }

    // Initialize the application
    init();
});