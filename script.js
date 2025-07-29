document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const overlay = document.getElementById('overlay');
    const quoteText = document.getElementById('quote-text');
    const removeBtn = document.getElementById('remove-btn');
    const downloadBtn = document.getElementById('download-btn');
    const fileLabel = document.getElementById('file-label');
    
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
            fileLabel.textContent = file.name;
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
        fileLabel.textContent = 'Choose Background Image';
    });
    
    // Update text styles
    function updateStyles() {
        quoteText.style.color = textColor.value;
        quoteText.style.fontFamily = fontFamily.value;
        quoteText.style.fontSize = `${fontSize.value}px`;
        
        // Update overlay
        const opacity = bgOpacity.value / 100;
        const rgbaColor = hexToRgba(bgColor.value, opacity);
        overlay.style.backgroundColor = rgbaColor;
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
        html2canvas(imagePreview, {
            backgroundColor: null,
            scale: 2,
            logging: false,
            useCORS: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'quote-image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
    
    // Initialize styles
    updateStyles();
});