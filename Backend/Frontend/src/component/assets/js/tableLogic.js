import html2canvas from 'html2canvas-pro';
import { oklch, rgb } from 'culori';

// Function to convert oklch to rgb
function convertOklchToRgb(oklchString) {
  const match = oklchString.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/);
  if (match) {
    const [_, l, c, h, alpha] = match;
    const oklchColor = oklch(parseFloat(l), parseFloat(c), parseFloat(h));
    const rgbColor = rgb(oklchColor);
    return `rgb(${Math.round(rgbColor.r * 255)}, ${Math.round(rgbColor.g * 255)}, ${Math.round(rgbColor.b * 255)}${alpha ? `, ${alpha}` : ''})`;
  }
  return oklchString; // Return original if not oklch
}

// Function to replace oklch colors in HTML string
function replaceOklchColors(htmlString) {
  return htmlString.replace(/oklch\([^)]+\)/g, (match) => convertOklchToRgb(match));
}

// Function to replace oklch colors in element's style
function replaceElementOklchColors(element) {
  const style = element.style;
  for (let i = 0; i < style.length; i++) {
    const prop = style[i];
    const value = style.getPropertyValue(prop);
    if (value.includes('oklch')) {
      style.setProperty(prop, convertOklchToRgb(value));
    }
  }

  // Recursively process child elements
  for (let child of element.children) {
    replaceElementOklchColors(child);
  }
}

// tableLogic function
export const tableLogic = () => {
  const tbody = document.getElementById('sortableTable');
  const totalAmountCell = document.querySelector('tfoot tr td:last-child');
  const addItemButton = document.getElementById('add-item-button');

  function updateRowAmount(row) {
    const priceCell = row.querySelector('td:nth-child(2)');
    const taxCell = row.querySelector('td:nth-child(3)');
    const amountCell = row.querySelector('td:nth-child(4)');

    const price = parseFloat(priceCell.innerText.replace('$', '')) || 0;
    const tax = parseFloat(taxCell.innerText.replace('%', '')) || 0;
    const amount = (price * (1 + tax / 100)).toFixed(2);
    amountCell.innerText = `$${amount}`;
  }

  function updateTotalAmount() {
    let totalAmount = 0;
    const amountCells = tbody.querySelectorAll('td:nth-child(4)');
    amountCells.forEach((cell) => {
      const amount = parseFloat(cell.innerText.replace('$', '')) || 0;
      totalAmount += amount;
    });
    totalAmountCell.innerText = `$${totalAmount.toFixed(2)}`;
  }

  function addRowEventListeners(row) {
    const cells = row.querySelectorAll('td');
    cells.forEach((cell) => {
      cell.addEventListener('input', () => {
        updateRowAmount(row);
        updateTotalAmount();
      });
    });
  }

  tbody.querySelectorAll('tr').forEach(addRowEventListeners);

  addItemButton.addEventListener('click', () => {
    const newRow = tbody.insertRow(-1);
    newRow.innerHTML = `
      <td contenteditable="true" draggable="true">New Item</td>
      <td contenteditable="true" draggable="true">$0.00</td>
      <td contenteditable="true" draggable="true">0%</td>
      <td contenteditable="true" draggable="true">$0.00</td>
    `;
    addRowEventListeners(newRow);
    updateRowAmount(newRow);
    updateTotalAmount();
  });

  tbody.querySelectorAll('tr').forEach(updateRowAmount);
  updateTotalAmount();
};

// Function to generate screenshot
async function htmlToImage(element) {
  // Clone the element to avoid modifying the original
  const clonedElement = element.cloneNode(true);
  
  // Replace oklch colors in the cloned element's HTML
  clonedElement.innerHTML = replaceOklchColors(clonedElement.innerHTML);
  
  // Replace oklch colors in inline styles
  replaceElementOklchColors(clonedElement);
  
  // Create a temporary container for the cloned element
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.appendChild(clonedElement);
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(clonedElement, {
      logging: false, // Disable logging
      useCORS: true, // Enable CORS for images
    });
    return canvas.toDataURL('image/png');
  } finally {
    // Clean up: remove the temporary container
    document.body.removeChild(container);
  }
}

// saveTemplate function
export async function saveTemplate() {
  console.log("Starting saveTemplate function");
  
  const htmlContent = document.querySelector('#html-content');
  const token = localStorage.getItem('token');

  console.log("Token from localStorage:", token ? "Present" : "Not found");

  if (!token) {
    console.error("No token found in localStorage");
    alert("Error: No authentication token found. Please log in again.");
    return;
  }

  const userString = localStorage.getItem('user');
  console.log("Raw user data from localStorage:", userString);

  let user;
  try {
    user = JSON.parse(userString);
    console.log("Parsed user data:", user);
  } catch (error) {
    console.error("Error parsing user data:", error);
    alert("Error: Unable to retrieve user data. Please log in again.");
    return;
  }

  if (!user || !user._id) {
    console.error("User data:", user);
    console.error("User ID not found in parsed data");
    alert("Error: User ID not found. Please log in again.");
    return;
  }

  try {
    // Generate screenshot
    const screenshot = await htmlToImage(htmlContent);
    console.log("Screenshot generated");

    const templateData = {
      name: "My Template",
      htmlContent: replaceOklchColors(htmlContent.innerHTML), // Replace oklch colors in HTML content
      thumbnail: screenshot,
      userId: user._id,
    };

    console.log("Template data being sent:", templateData);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/templates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(templateData),
    });

    console.log("Response status:", response.status);

    if (response.ok) {
      const savedTemplate = await response.json();
      console.log("Template saved successfully!");
      console.log("Saved template:", savedTemplate);
    } else {
      const errorData = await response.json();
      console.error("Error saving template:", response.status, errorData);

    }
  } catch (error) {
    console.error("Error saving template:", error);
  }
}

