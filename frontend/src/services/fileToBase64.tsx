
export const fileToBase64 = (file: File): Promise<string> => {
    console.log('📸 Conversione file a Base64...');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        
        // 🔍 DEBUG: Mostra la stringa completa prima della pulizia
        console.log('📸 Base64 RAW (primi 100 caratteri):', base64String.substring(0, 100));
        
        // Rimuovi il prefisso data:image/jpeg;base64,
        const base64Data = base64String.split(',')[1];
        
        // 🔍 DEBUG: Mostra dopo la pulizia
        console.log('✅ Base64 PULITO (primi 100 caratteri):', base64Data.substring(0, 100));
        console.log('📊 Lunghezza totale:', base64Data.length);
        console.log('🔤 Ultimi 10 caratteri:', base64Data.slice(-10));
        
        // Verifica caratteri validi
        const isValidBase64 = /^[A-Za-z0-9+/]*={0,2}$/.test(base64Data);
        console.log('✓ Base64 valido?', isValidBase64);
        
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };