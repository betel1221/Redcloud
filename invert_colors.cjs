const fs = require('fs');
const files = [
  'd:/betel/vs/RedCloud/src/pages/Landing.tsx', 
  'd:/betel/vs/RedCloud/src/pages/Login.tsx', 
  'd:/betel/vs/RedCloud/src/pages/Signup.tsx',
  'd:/betel/vs/RedCloud/tailwind.config.js'
];

files.forEach(f => {
  let text = fs.readFileSync(f, 'utf8');
  
  // 1. Text colors inversion
  // Turn existing white text to black
  text = text.replace(/text-white/g, 'text-black');
  
  // Turn muted gray text to darker gray for readability on white
  text = text.replace(/#A1A1AA/g, '#4B5563'); 

  // 2. Buttons inversion
  // The primary buttons were bg-white text-black. We want them to be Red background with White text.
  text = text.replace(/bg-white text-black/g, 'bg-[#DC2626] text-white');
  
  // Loaders inside buttons should also be white now
  text = text.replace(/text-black/g, (match, offset, str) => {
    // If it's the text-black we just inverted from text-white, keep it.
    // Actually, just change the Loader2 text-black manually.
    return match;
  });
  text = text.replace(/animate-spin text-black/g, 'animate-spin text-white');

  // 3. Backgrounds inversion
  text = text.replace(/#DC2626/g, '#FFFFFF'); // Main background -> White
  text = text.replace(/#B91C1C/g, '#F9FAFB'); // Card background -> Light Gray
  
  // 4. Borders and Hover states
  text = text.replace(/#F87171/g, '#FECACA'); // Borders -> Very light red
  text = text.replace(/#991B1B/g, '#FEE2E2'); // Hover states -> Light red

  // 5. Adjust translucent whites (from the dark mode) to translucent reds (for light mode)
  text = text.replace(/bg-white\//g, 'bg-[#DC2626]/');
  text = text.replace(/border-white\//g, 'border-[#DC2626]/');
  
  // 6. Fix specific logos/icons to be Red instead of Black so they pop
  text = text.replace(/Activity className="w-8 h-8 text-black"/g, 'Activity className="w-8 h-8 text-[#DC2626]"');
  text = text.replace(/Activity className="w-6 h-6 text-black"/g, 'Activity className="w-6 h-6 text-[#DC2626]"');
  text = text.replace(/Activity className="w-10 h-10 text-black"/g, 'Activity className="w-10 h-10 text-[#DC2626]"');
  
  fs.writeFileSync(f, text);
});

console.log('Switched to White Base / Red Accents successfully!');
