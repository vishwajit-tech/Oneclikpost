document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const quoteText = document.getElementById('quote-text');
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    
    const textColor = document.getElementById('text-color');
    const fontFamily = document.getElementById('font-family');
    const fontSize = document.getElementById('font-size');
    const textAlign = document.getElementById('text-align');
    
    // Handle image upload
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imagePreview.style.backgroundImage = `url(${event.target.result})`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Update text styles
    function updateTextStyles() {
        quoteText.style.color = textColor.value;
        quoteText.style.fontFamily = fontFamily.value;
        quoteText.style.fontSize = `${fontSize.value}px`;
        quoteText.style.textAlign = textAlign.value;
    }
    
    textColor.addEventListener('input', updateTextStyles);
    fontFamily.addEventListener('change', updateTextStyles);
    fontSize.addEventListener('input', updateTextStyles);
    textAlign.addEventListener('change', updateTextStyles);
    
    // Generate and download image
    downloadBtn.addEventListener('click', function() {
        if (!imagePreview.style.backgroundImage) {
            alert('Please upload an image first');
            return;
        }
        
        html2canvas(imagePreview).then(canvas => {
            const link = document.createElement('a');
            link.download = 'quote-image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
    
    // Placeholder text behavior
    quoteText.addEventListener('focus', function() {
        if (this.textContent === 'Type your quote here...') {
            this.textContent = '';
        }
    });
    
    quoteText.addEventListener('blur', function() {
        if (this.textContent === '') {
            this.textContent = 'Type your quote here...';
        }
    });
});