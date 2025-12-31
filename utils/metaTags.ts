interface MetaTagsConfig {
    title: string;
    description: string;
    image: string;
    url: string;
}

/**
 * Update meta tags dynamically for better social sharing (Telegram/WhatsApp)
 * Call this function when a property page loads
 */
export const updateMetaTags = (config: MetaTagsConfig) => {
    // Update page title
    document.title = config.title;

    // Update Open Graph and Twitter meta tags
    const metaTags = {
        'og:title': config.title,
        'og:description': config.description,
        'og:image': config.image,
        'og:url': config.url,
        'twitter:title': config.title,
        'twitter:description': config.description,
        'twitter:image': config.image,
        'twitter:url': config.url,
    };

    Object.entries(metaTags).forEach(([property, content]) => {
        // Try finding by property attribute
        let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;

        // Fallback to name attribute
        if (!element) {
            element = document.querySelector(`meta[name="${property}"]`) as HTMLMetaElement;
        }

        if (element) {
            element.setAttribute('content', content);
        } else {
            // Create if doesn't exist
            const newElement = document.createElement('meta');
            newElement.setAttribute('property', property);
            newElement.setAttribute('content', content);
            document.head.appendChild(newElement);
        }
    });

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
        canonical.href = config.url;
    } else {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = config.url;
        document.head.appendChild(canonical);
    }
};

/**
 * Format price in Ethiopian Birr
 */
export const formatPriceETB = (price: number): string => {
    return new Intl.NumberFormat('en-ET', {
        style: 'currency',
        currency: 'ETB',
        minimumFractionDigits: 0
    }).format(price).replace('ETB', 'ETB ');
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

/**
 * Generate share URL for WhatsApp
 */
export const getWhatsAppShareUrl = (text: string): string => {
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
};

/**
 * Generate share URL for Telegram
 */
export const getTelegramShareUrl = (url: string, text: string): string => {
    return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
};

/**
 * Generate property share text
 */
export const generatePropertyShareText = (property: {
    title: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    size: number;
    location: string;
    url: string;
}): string => {
    return `🏠 ${property.title}

💰 Price: ${formatPriceETB(property.price)}
📍 Location: ${property.location}
🛏️ Bedrooms: ${property.bedrooms}
🚿 Bathrooms: ${property.bathrooms}
📐 Size: ${formatNumber(property.size)} sqm

View Details: ${property.url}`;
};
