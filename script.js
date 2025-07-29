document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const quoteText = document.getElementById('quote-text');
    const removeBtn = document.getElementById('remove-btn');
    const downloadBtn = document.getElementById('download-btn');
    
    // Control elements
    const textColor = document.getElementById('text-color');
    const bgColor = document.getElementById('bg-color');
    const bgOpacity = document.getElementById('bg-opacity');
    const fontFamily = document.getElementById('font-family');
    const fontSize = document.getElementById('font-size');
    
    // Handle image upload
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imagePreview.style.backgroundImage = `url('${event.target.result}')`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Remove image
    removeBtn.addEventListener('click', function() {
        imagePreview.style.backgroundImage = 'none';
        imageUpload.value = '';
    });
    
    // Update text styles
    function updateStyles() {
        quoteText.style.color = textColor.value;
        quoteText.style.fontFamily = fontFamily.value;
        quoteText.style.fontSize = `${fontSize.value}px`;
        
        // Update overlay
        const opacity = bgOpacity.value / 100;
        const rgbaColor = hexToRgba(bgColor.value, opacity);
        imagePreview.querySelector('::after')?.remove();
        
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.backgroundColor = rgbaColor;
        overlay.style.zIndex = '1';
        
        const existingOverlay = imagePreview.querySelector('.overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        overlay.classList.add('overlay');
        imagePreview.appendChild(overlay);
    }
    
    // Helper function to convert hex to rgba
    function hexToRgba(hex, opacity) {
        let r = 0, g = 0, b = 0;
        
        // 3 digits
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        }
        // 6 digits
        else if (hex.length === 7) {
            r = parseInt(hex[1] + hex[2], 16);
            g = parseInt(hex[3] + hex[4], 16);
            b = parseInt(hex[5] + hex[6], 16);
        }
        
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    // Add event listeners to controls
    textColor.addEventListener('input', updateStyles);
    bgColor.addEventListener('input', updateStyles);
    bgOpacity.addEventListener('input', updateStyles);
    fontFamily.addEventListener('change', updateStyles);
    fontSize.addEventListener('input', updateStyles);
    
    // Download image
    downloadBtn.addEventListener('click', function() {
        // Temporarily hide controls for clean screenshot
        const controls = document.querySelector('.controls');
        const originalDisplay = controls.style.display;
        controls.style.display = 'none';
        
        html2canvas(imagePreview, {
            backgroundColor: null,
            scale: 2,
            logging: false
        }).then(canvas => {
            // Restore controls
            controls.style.display = originalDisplay;
            
            // Create download link
            const link = document.createElement('a');
            link.download = 'quote-image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
    
    // Initialize styles
    updateStyles();
});