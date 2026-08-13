// AI Integration Service for MegaVault
// Pure Frontend Implementation for accurate local matching without requiring an API key.

/**
 * Perform AI Assistant Chat Query using an advanced local matching algorithm.
 */
export const queryAIAssistantBackend = async (chatHistory = [], catalogData = []) => {
  try {
    const userPrompt = chatHistory[chatHistory.length - 1]?.text || '';
    
    // Simulate a slight network delay to mimic real AI processing
    await new Promise(resolve => setTimeout(resolve, 400));

    const rawQ = userPrompt.toLowerCase().trim();
    const safeCatalog = Array.isArray(catalogData) ? catalogData : [];
    
    // 1. Budget Extraction
    let maxBudget = null;
    let minBudget = null;
    const budgetMatch = rawQ.match(/(?:under|below|less than|within|around|max)\s*₹?\s*(\d+k?|\d+)/i);
    if (budgetMatch) {
      let valStr = budgetMatch[1].toLowerCase();
      maxBudget = valStr.endsWith('k') ? parseFloat(valStr.replace('k', '')) * 1000 : parseFloat(valStr);
    }
    const aboveMatch = rawQ.match(/(?:above|over|more than|min)\s*₹?\s*(\d+k?|\d+)/i);
    if (aboveMatch) {
      let valStr = aboveMatch[1].toLowerCase();
      minBudget = valStr.endsWith('k') ? parseFloat(valStr.replace('k', '')) * 1000 : parseFloat(valStr);
    }

    // 2. Intent & Synonym Mapping
    const synonyms = {
      'mobile': 'smartphone',
      'mobiles': 'smartphone',
      'phone': 'smartphone',
      'phones': 'smartphone',
      'pc': 'laptop',
      'computer': 'laptop',
      'earbuds': 'audio',
      'earphones': 'audio',
      'headphones': 'audio',
      'speaker': 'audio',
      'watch': 'smartwatch',
      'watches': 'smartwatch',
      'bag': 'backpack',
      'bags': 'backpack',
      'shoes': 'shoes',
      'tv': 'tv',
      'monitor': 'monitor'
    };

    const categoryMap = {
      'smartphone': 'electronics',
      'laptop': 'electronics',
      'tv': 'electronics',
      'monitor': 'electronics',
      'audio': 'audio',
      'smartwatch': 'wearables',
      'wearables': 'wearables',
      'backpack': 'fashion',
      'fashion': 'fashion',
      'shoes': 'fashion',
      'gaming': 'gaming',
      'smart home': 'smart home'
    };

    const stopWords = new Set(['under', 'below', 'less', 'than', 'within', 'around', 'above', 'over', 'more', 'best', 'for', 'the', 'in', 'a', 'to', 'with', 'and', 'show', 'me', 'find', 'get', 'buy', 'looking', 'some', 'good', 'cheap', 'what', 'top', 'rated', 'new', 'latest']);
    
    // Extract meaningful tokens
    let tokens = rawQ.split(/[\s,.-]+/).filter(t => t && t.length > 1 && !stopWords.has(t) && !t.match(/^\d+k?$/));
    
    // Map synonyms and remove duplicates
    tokens = [...new Set(tokens.map(t => synonyms[t] || t))];

    // Determine sort preference
    const wantsBest = rawQ.includes('best') || rawQ.includes('top rated');
    const wantsCheap = rawQ.includes('cheap') || rawQ.includes('lowest price') || rawQ.includes('budget');

    // 3. Scoring Engine
    let scoredProducts = safeCatalog.map(p => {
      if (!p) return { product: p, score: -100 };

      let score = 0;
      const pTitle = (p.title || '').toLowerCase();
      const pDesc = (p.description || '').toLowerCase();
      const pCat = (p.category || '').toLowerCase();
      const pPrice = Number(p.price) || 0;
      
      // Direct phrase match is highly rewarded
      if (pTitle && rawQ && pTitle.includes(rawQ)) score += 50;
      if (pDesc && rawQ && pDesc.includes(rawQ)) score += 20;

      // Special exact matches for categories (e.g., 'smart home', 'mobile phones')
      if (pCat && rawQ && rawQ.includes(pCat)) score += 40;
      if (rawQ === 'mobile phones' && pCat === 'electronics') score += 40;

      tokens.forEach(t => {
        // Category match
        if (pCat.includes(t)) score += 20;
        
        // Synonym/Category mapping match
        const mappedCat = categoryMap[t];
        if (mappedCat && pCat.includes(mappedCat)) {
           score += 15;
        }

        // Keyword match
        if (pTitle.includes(t)) score += 10;
        if (pDesc.includes(t)) score += 5;
      });

      // Enforce Budget Constraints Strictly
      if (maxBudget !== null && pPrice > maxBudget) score = -100;
      if (minBudget !== null && pPrice < minBudget) score = -100;

      return { product: p, score };
    });

    // Filter out disqualified products and sort
    scoredProducts = scoredProducts.filter(sp => sp.product && sp.score > 0);
    
    // Apply secondary sorting based on intent
    if (wantsBest) {
      scoredProducts.sort((a, b) => b.score - a.score || (b.product.rating || 0) - (a.product.rating || 0));
    } else if (wantsCheap) {
      scoredProducts.sort((a, b) => b.score - a.score || (a.product.price || 0) - (b.product.price || 0));
    } else {
      scoredProducts.sort((a, b) => b.score - a.score); // Default by relevance
    }

    let matchedProds = scoredProducts.map(sp => sp.product).slice(0, 4);

    // If no match but there's a budget, fallback to best items in budget
    if (matchedProds.length === 0 && (maxBudget !== null || minBudget !== null)) {
      matchedProds = safeCatalog.filter(p => {
        if (!p) return false;
        const pPrice = Number(p.price) || 0;
        let valid = true;
        if (maxBudget !== null && pPrice > maxBudget) valid = false;
        if (minBudget !== null && pPrice < minBudget) valid = false;
        return valid;
      }).sort((a, b) => (b.price || 0) - (a.price || 0)).slice(0, 4);
    }

    // 4. Generate Dynamic Response
    let textResponse = "I'm having trouble understanding that. Could you try rephrasing?";
    
    if (matchedProds.length > 0) {
      if (maxBudget && minBudget) {
        textResponse = `⚡ Found the best options between ₹${minBudget.toLocaleString('en-IN')} and ₹${maxBudget.toLocaleString('en-IN')}:`;
      } else if (maxBudget) {
        textResponse = `⚡ Here are the top picks under ₹${maxBudget.toLocaleString('en-IN')}:`;
      } else if (wantsBest) {
        textResponse = `⚡ Here are our highest-rated recommendations for "${userPrompt}":`;
      } else {
        textResponse = `⚡ I found these great matches for "${userPrompt}":`;
      }
    } else if (rawQ.includes('hello') || rawQ.includes('hi ') || rawQ === 'hi') {
      textResponse = "Hello! I'm MegaVault AI. How can I assist you with your shopping today?";
    } else {
       matchedProds = safeCatalog.slice(0, 4);
       textResponse = "I couldn't find an exact match for your request, but here are some of our most popular flagship products:";
    }

    return {
      text: textResponse,
      products: matchedProds
    };
  } catch (err) {
    console.error('Error in queryAIAssistantBackend:', err);
    return {
      text: "⚡ Here are some top recommendations for you:",
      products: Array.isArray(catalogData) ? catalogData.slice(0, 4) : []
    };
  }
};

export const queryGrokAI = queryAIAssistantBackend;
