export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método não permitido' });
    }
    
    const { url } = req.query;
    
    if (!url) {
        return res.status(400).json({ error: 'URL é obrigatória' });
    }
    
    try {
        console.log('🖼️ Fazendo download da imagem:', url);
        
        // Fazer o download da imagem
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao baixar imagem: ${response.status} ${response.statusText}`);
        }
        
        // Obter o conteúdo da imagem
        const imageBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        
        console.log('✅ Imagem baixada com sucesso:', {
            size: imageBuffer.byteLength,
            contentType: contentType
        });
        
        // Retornar a imagem
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', imageBuffer.byteLength);
        res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache por 1 hora
        
        return res.send(Buffer.from(imageBuffer));
        
    } catch (error) {
        console.error('❌ Erro ao baixar imagem:', error);
        return res.status(500).json({ 
            error: 'Erro ao baixar imagem',
            details: error.message 
        });
    }
}
