export class FileUtils {
  async convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string); // Devuelve el resultado como base64
      reader.onerror = () => reject(new Error('Failed to convert file to Base64'));
      reader.readAsDataURL(file); // Leer el archivo directamente
    });
  }


}
