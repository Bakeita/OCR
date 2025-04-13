let pdfDoc = null;
let pageNum = 1;
let scale = 1.5;

const canvas = document.getElementById("pdf-canvas");
const ctx = canvas.getContext("2d");
const textLayerDiv = document.getElementById("text-layer");

const word = document.getElementById("word")
const selectedword = document.getElementById("selectedword")

function groupTextAsParagraphs() {
  const textLayer = document.getElementById("text-layer");
  const spans = Array.from(textLayer.querySelectorAll("span"));

  // Step 1: Group spans by their "top" position
  const lines = {};
  spans.forEach(span => {
    const top = parseFloat(span.style.top);
    if (!lines[top]) lines[top] = [];
    lines[top].push(span);
  });

  // Step 2: Sort lines vertically
  const sortedTops = Object.keys(lines).map(Number).sort((a, b) => a - b);

  // Step 3: Group lines into paragraphs
  const paragraphs = [];
  let currentPara = [];

  const LINE_GAP = 10; // adjust this value depending on your PDF line spacing

  sortedTops.forEach((top, i) => {
    const currentLine = lines[top];
    const prevTop = i > 0 ? sortedTops[i - 1] : null;

    if (prevTop !== null && (top - prevTop) > LINE_GAP) {
      // New paragraph
      if (currentPara.length > 0) paragraphs.push(currentPara);
      currentPara = [];
    }

    currentPara.push(...currentLine);
  });

  if (currentPara.length > 0) paragraphs.push(currentPara);

  // Step 4: Clear old spans and insert grouped paragraphs
  textLayer.innerHTML = "";

  paragraphs.forEach(group => {
    const paraDiv = document.createElement("div");
    paraDiv.className = "pdf-paragraph";
    paraDiv.style.position = "relative";
    paraDiv.style.marginBottom = "1em";

    group.forEach(span => {
      paraDiv.appendChild(span);
    });

    textLayer.appendChild(paraDiv);
  });
}


// text highlighting
document.addEventListener("mouseup", () => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    console.log(selectedText)
    if (selectedText.length > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.className = "highlight";
      span.appendChild(range.extractContents());
      range.insertNode(span);
      // Clear selection
      selection.removeAllRanges();
      submitWord(selectedText)
    }
  });

  function removeHighlights() {
    const highlights = document.querySelectorAll(".highlight");
    highlights.forEach(span => {
      const parent = span.parentNode;
      while (span.firstChild) {
        parent.insertBefore(span.firstChild, span);
      }
      parent.removeChild(span);
    });
  }

// Load PDF
const loadPDF = async (file) => {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = async () => {
    const pdfData = new Uint8Array(reader.result);
    pdfDoc = await pdfjsLib.getDocument(pdfData).promise;
    pageNum = 1;
    renderPage(pageNum);
  };
};

// Render Page
const renderPage = async (num) => {
  const page = await pdfDoc.getPage(num);
  const viewport = page.getViewport({ scale });

  // Resize canvas & text layer
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  textLayerDiv.style.width = `${viewport.width + 30}px`;
  textLayerDiv.style.height = `${viewport.height}px`;
  textLayerDiv.style.top = `${canvas.offsetTop}px`;
  textLayerDiv.style.left = `${canvas.offsetLeft}px`;

  // Render PDF page on canvas
  const renderContext = { canvasContext: ctx, viewport };
//   await page.render(renderContext).promise;

  // Render selectable text
  textLayerDiv.innerHTML = ""; // Clear old text
  const textContent = await page.getTextContent();
  pdfjsLib.renderTextLayer({
    textContent,
    container: textLayerDiv,
    viewport,
    textDivs: [],
    enhanceTextSelection: true,
  });
  // groupTextAsParagraphs();

  // Update page info
  document.getElementById("page-info").textContent = `Page ${pageNum} / ${pdfDoc.numPages}`;
};

// Event Listeners
document.getElementById("file-input").addEventListener("change", (e) => {
  if (e.target.files[0]?.type === "application/pdf") {
    loadPDF(e.target.files[0]);
  }
});

document.getElementById("prev").addEventListener("click", () => {
  if (pageNum > 1) renderPage(--pageNum);
});

document.getElementById("next").addEventListener("click", () => {
  if (pageNum < pdfDoc.numPages) renderPage(++pageNum);
});

document.getElementById("zoom-in").addEventListener("click", () => {
  scale += 0.2;
  renderPage(pageNum);
});


document.getElementById("zoom-out").addEventListener("click", () => {
  if (scale > 0.4) {
    scale -= 0.2;
    renderPage(pageNum);
  }
});

async function submitWord(selectedText) {
    // event.preventDefault(); // Prevent default form submission
    const formData = new FormData(); // Create FormData object
    formData.append("selectedWord",selectedText) 
    try {
      const response = await fetch("http://127.0.0.1:5000/words", {
        method: "POST",
        body: formData, // Content-Type is set automatically
      });
      const result = await response.json(); // Parse JSON response
      const defintion = result['wordDefinition'];
      selectedword.innerText = selectedText
      word.innerText = defintion;
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  }