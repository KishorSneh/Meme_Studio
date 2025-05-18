// Global settings and variables
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
let image = new Image();

// Default settings
let settings = {
  fontSize: 48,
  textColor: '#ffffff',
  strokeColor: '#000000',
  strokeWidth: 4
};

// DOM elements
const fileInputWrapper = document.getElementById('fileInputWrapper');
const fileInputLabel = document.getElementById('fileInputLabel');
const imageInput = document.getElementById('imageInput');
const topTextInput = document.getElementById('topText');
const bottomTextInput = document.getElementById('bottomText');
const toggleOptionsBtn = document.getElementById('toggleOptions');
const optionsPanel = document.getElementById('optionsPanel');
const fontSizeInput = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');
const strokeWidthInput = document.getElementById('strokeWidth');
const strokeWidthValue = document.getElementById('strokeWidthValue');
const textColorInput = document.getElementById('textColor');
const strokeColorInput = document.getElementById('strokeColor');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Initialize the canvas with placeholder content
function initCanvas() {
  ctx.fillStyle = '#1a1a22';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw placeholder graphics
  ctx.fillStyle = '#2a2a35';
  ctx.beginPath();
  ctx.moveTo(150, 150);
  ctx.lineTo(350, 150);
  ctx.lineTo(350, 350);
  ctx.lineTo(150, 350);
  ctx.closePath();
  ctx.fill();
  
  ctx.fillStyle = '#3a3a48'; 
  ctx.beginPath();
  ctx.arc(250, 250, 80, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw placeholder text
  ctx.fillStyle = '#6366f1';
  ctx.font = '20px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Select an image to create your meme', canvas.width/2, canvas.height/2 + 120);
  
  ctx.font = '16px Inter, sans-serif';
  ctx.fillStyle = '#a0a0b8';
  ctx.fillText('Supports JPG, PNG, and GIF formats', canvas.width/2, canvas.height/2 + 150);
  
  // Draw icon
  ctx.fillStyle = '#4f46e5';
  ctx.beginPath();
  ctx.moveTo(220, 210);
  ctx.lineTo(280, 210);
  ctx.lineTo(280, 270);
  ctx.lineTo(220, 270);
  ctx.closePath();
  ctx.fill();
  
  ctx.fillStyle = '#6366f1';
  ctx.beginPath();
  ctx.moveTo(230, 230);
  ctx.lineTo(270, 230);
  ctx.lineTo(270, 250);
  ctx.lineTo(230, 250);
  ctx.closePath();
  ctx.fill();
  
  ctx.strokeStyle = '#2a2a35';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(240, 220);
  ctx.lineTo(260, 220);
  ctx.stroke();
}

// Handle file input change
function handleFileInput(e) {
  if (this.files && this.files[0]) {
    const fileName = this.files[0].name;
    fileInputLabel.textContent = fileName;
    fileInputWrapper.classList.add('file-selected');
    
    const reader = new FileReader();
    reader.onload = function(e) {
      image.onload = drawMeme;
      image.src = e.target.result;
    };
    reader.readAsDataURL(this.files[0]);
  } else {
    fileInputLabel.textContent = 'Choose an image or drop it here';
    fileInputWrapper.classList.remove('file-selected');
  }
}

// Toggle advanced options panel
function toggleOptions() {
  optionsPanel.classList.toggle('visible');
  
  if (optionsPanel.classList.contains('visible')) {
    this.innerHTML = '<i class="fas fa-chevron-up"></i> Hide advanced options';
  } else {
    this.innerHTML = '<i class="fas fa-sliders-h"></i> Advanced options';
  }
}

// Update font size display
function updateFontSize() {
  settings.fontSize = parseInt(this.value);
  fontSizeValue.textContent = `${this.value}px`;
  if (image.src) drawMeme();
}

// Update stroke width display
function updateStrokeWidth() {
  settings.strokeWidth = parseInt(this.value);
  strokeWidthValue.textContent = `${this.value}px`;
  if (image.src) drawMeme();
}

// Update text color
function updateTextColor() {
  settings.textColor = this.value;
  if (image.src) drawMeme();
}

// Update stroke color
function updateStrokeColor() {
  settings.strokeColor = this.value;
  if (image.src) drawMeme();
}

// Debounce function for text inputs
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Update meme on text input changes
const updateMeme = debounce(() => {
  if (image.src) drawMeme();
}, 300);

// Handle drag over event
function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  this.classList.add('file-selected');
}

// Handle drag leave event
function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  if (!imageInput.files.length) {
    this.classList.remove('file-selected');
  }
}

// Handle drop event
function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    imageInput.files = e.dataTransfer.files;
    
    // Trigger change event
    const event = new Event('change', { bubbles: true });
    imageInput.dispatchEvent(event);
  }
}

// Draw meme with current settings
function drawMeme() {
  const top = topTextInput.value;
  const bottom = bottomTextInput.value;
  
  // Clear canvas and draw image
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Calculate aspect ratio for proper image fit
  const hRatio = canvas.width / image.width;
  const vRatio = canvas.height / image.height;
  const ratio = Math.min(hRatio, vRatio);
  
  // Calculate centered position
  const centerShiftX = (canvas.width - image.width * ratio) / 2;
  const centerShiftY = (canvas.height - image.height * ratio) / 2;
  
  // Draw image with proper scaling
  ctx.drawImage(
    image, 
    0, 0, image.width, image.height,
    centerShiftX, centerShiftY, image.width * ratio, image.height * ratio
  );
  
  // Set text properties
  ctx.fillStyle = settings.textColor;
  ctx.strokeStyle = settings.strokeColor;
  ctx.lineWidth = settings.strokeWidth;
  ctx.textAlign = 'center';
  ctx.font = `bold ${settings.fontSize}px Impact, Arial, sans-serif`;
  ctx.lineJoin = 'round'; // Smoother text corners
  
  // Draw top and bottom text
  if (top) drawWrappedText(top, canvas.width / 2, settings.fontSize + 10, true);
  if (bottom) drawWrappedText(bottom, canvas.width / 2, canvas.height - 10, false);
}

// Draw text with word wrapping
function drawWrappedText(text, x, y, isTop) {
  const maxWidth = canvas.width - 40;
  const lineHeight = settings.fontSize * 1.2;
  const words = text.split(' ');
  const lines = [];
  let line = '';
  
  // Break text into lines
  for (let word of words) {
    const testLine = line + word + ' ';
    const testWidth = ctx.measureText(testLine).width;
    
    if (testWidth > maxWidth && line !== '') {
      lines.push(line);
      line = word + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  
  // Draw each line with proper positioning
  lines.forEach((l, i) => {
    const offset = isTop
      ? y + i * lineHeight
      : y - (lines.length - 1 - i) * lineHeight;
      
    // Draw stroke first, then fill over it
    ctx.strokeText(l, x, offset);
    ctx.fillText(l, x, offset);
  });
}

// Download meme as PNG
function downloadMeme() {
  // Add subtle effect when downloading
  canvas.style.transform = 'scale(0.98)';
  setTimeout(() => {
    canvas.style.transform = 'scale(1)';
  }, 150);
  
  // Create the download
  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Handle window resize
function handleResize() {
  if (image.src) {
    requestAnimationFrame(drawMeme);
  }
}

// Initialize the app
function init() {
  // Set up initial canvas
  initCanvas();
  
  // Add event listeners
  imageInput.addEventListener('change', handleFileInput);
  toggleOptionsBtn.addEventListener('click', toggleOptions.bind(toggleOptionsBtn));
  fontSizeInput.addEventListener('input', updateFontSize);
  strokeWidthInput.addEventListener('input', updateStrokeWidth);
  textColorInput.addEventListener('input', updateTextColor);
  strokeColorInput.addEventListener('input', updateStrokeColor);
  topTextInput.addEventListener('input', updateMeme);
  bottomTextInput.addEventListener('input', updateMeme);
  fileInputWrapper.addEventListener('dragover', handleDragOver);
  fileInputWrapper.addEventListener('dragleave', handleDragLeave);
  fileInputWrapper.addEventListener('drop', handleDrop);
  generateBtn.addEventListener('click', drawMeme);
  downloadBtn.addEventListener('click', downloadMeme);
  window.addEventListener('resize', handleResize);
}

// Start the application
document.addEventListener('DOMContentLoaded', init);