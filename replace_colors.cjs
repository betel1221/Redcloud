const fs = require('fs');
const files = [
  'd:/betel/vs/RedCloud/src/pages/Landing.tsx', 
  'd:/betel/vs/RedCloud/src/pages/Login.tsx', 
  'd:/betel/vs/RedCloud/src/pages/Signup.tsx', 
  'd:/betel/vs/RedCloud/tailwind.config.js'
];

files.forEach(f => {
  let text = fs.readFileSync(f, 'utf8');
  // Pitch black -> Red 600
  text = text.replace(/#000000/g, '#DC2626');
  // Darkest gray -> Red 700
  text = text.replace(/#09090b/g, '#B91C1C');
  text = text.replace(/#0A0A0A/g, '#B91C1C');
  // Border gray -> Red 400
  text = text.replace(/#27272A/g, '#F87171');
  text = text.replace(/#262626/g, '#F87171');
  // Hover gray -> Red 800
  text = text.replace(/#121214/g, '#991B1B');
  text = text.replace(/#1A1A1A/g, '#991B1B');
  fs.writeFileSync(f, text);
});
console.log('Colors replaced successfully!');
