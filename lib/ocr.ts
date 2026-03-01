import Tesseract from "tesseract.js";

let worker: Tesseract.Worker | null = null;

/**
 * Initialize Tesseract OCR worker
 */
export async function initOCR(): Promise<Tesseract.Worker> {
  if (worker) return worker;

  worker = await Tesseract.createWorker("spa", 1, {
    logger: (m) => {
      if (m.status === "recognizing text") {
        console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
      }
    },
  });

  return worker;
}

/**
 * Preprocess image for better OCR results
 */
function preprocessImage(
  imageData: ImageData,
  canvas: HTMLCanvasElement
): string {
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);

  // Convert to grayscale and increase contrast
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const contrast = 1.5;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    const newValue = Math.min(255, Math.max(0, factor * (avg - 128) + 128));
    data[i] = data[i + 1] = data[i + 2] = newValue;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

/**
 * Extract serial number from image using OCR
 */
export async function extractSerialFromImage(
  imageData: string | HTMLCanvasElement | HTMLImageElement
): Promise<string> {
  try {
    const ocrWorker = await initOCR();
    
    const {
      data: { text },
    } = await ocrWorker.recognize(imageData);

    // Limpiar el texto de caracteres comunes incorrectos
    let cleanText = text
      .replace(/[|\[\](){}]/g, '') // Eliminar paréntesis y corchetes
      .replace(/AI/gi, '') // Eliminar "AI" común en OCR
      .replace(/[OoQq]/g, '0') // Confusión O con 0
      .replace(/[Il]/g, '1') // Confusión I/l con 1
      .toUpperCase();

    // Patron: 9 dígitos + espacio + clase (A o B)
    const serialPattern = /\d{9}\s[AB]/g;
    const matches = cleanText.match(serialPattern);

    if (matches && matches.length > 0) {
      return matches[0];
    }

    // Patrón flexible: 9 dígitos seguidos de A o B (con o sin espacio)
    const flexiblePattern = /\d{9}[\s\-]?[AB]/g;
    const flexibleMatches = cleanText.match(flexiblePattern);

    if (flexibleMatches && flexibleMatches.length > 0) {
      // Asegurar que tenga el formato correcto con espacio
      const match = flexibleMatches[0];
      return match.replace(/(\d{9})[\s\-]?([AB])/, '$1 $2');
    }

    // Si no se encuentra, intentar buscar 9 dígitos seguidos y agregar espacio + A por defecto
    const digitsOnly = cleanText.match(/\d{9}/);
    if (digitsOnly) {
      return digitsOnly[0] + ' A';
    }

    throw new Error("No se pudo detectar un número de serie válido en la imagen");
  } catch (error) {
    console.error("OCR Error:", error);
    throw error;
  }
}

/**
 * Terminate OCR worker
 */
export async function terminateOCR(): Promise<void> {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
}
