/**
 * AI Content Generation Service
 * Handles API calls for image, music, video, and podcast generation
 */

export type ContentType = 'image' | 'music' | 'video' | 'podcast';

export interface GenerationRequest {
  prompt: string;
  type?: string;
}

export interface GenerationResponse {
  url?: string;
  output?: string;
  data?: { url?: string };
  image_url?: string;
  imageUrl?: string;
  file_url?: string;
  generated_url?: string;
  result?: string;
  link?: string;
  src?: string;
  path?: string;
  content_url?: string;
  media_url?: string;
  error?: string;
  status?: string;
  message?: string;
}

export class AIGenerationService {
  private static readonly API_ENDPOINTS: Record<ContentType, string> = {
    image: 'https://replicate-api-343916782787.us-central1.run.app',
    music: 'https://replicate-music-api-343916782787.us-central1.run.app',
    video: 'https://replicate-video-api-343916782787.us-central1.run.app',
    podcast: 'https://replicate-music-api-343916782787.us-central1.run.app' // same as music
  };

  private static readonly DEFAULT_TIMEOUT = 60000; // 60 seconds

  /**
   * Generate content using AI APIs
   */
  static async generateContent(
    type: ContentType, 
    prompt: string, 
    onProgress?: (message: string) => void
  ): Promise<string> {
    if (!prompt.trim()) {
      throw new Error('Please enter a prompt to generate content');
    }

    const apiUrl = `${this.API_ENDPOINTS[type]}/generate`;
    const requestBody: GenerationRequest = { prompt };
    
    // Add type-specific parameters
    if (type === 'podcast') {
      requestBody.type = 'podcast';
    }

    onProgress?.(`Connecting to ${type} generation API...`);

    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout - API took too long to respond')), this.DEFAULT_TIMEOUT);
    });

    // Make the API request with timeout
    const responsePromise = fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody),
    });

    onProgress?.(`Generating ${type} content...`);

    let response = await Promise.race([responsePromise, timeoutPromise]);

    // Handle different HTTP status codes with specific error messages
    await this.handleResponseErrors(response, type, apiUrl, requestBody);

    onProgress?.('Processing generated content...');

    const result = await this.parseResponse(response);
    const contentUrl = this.extractContentUrl(result, type);

    onProgress?.('Content generated successfully!');
    return contentUrl;
  }

  /**
   * Handle HTTP response errors
   */
  private static async handleResponseErrors(
    response: Response, 
    type: ContentType, 
    apiUrl: string, 
    requestBody: GenerationRequest
  ): Promise<Response> {
    if (response.status === 404) {
      throw new Error(`${type.charAt(0).toUpperCase() + type.slice(1)} generation service not found. Please try again later.`);
    }
    
    if (response.status === 429) {
      throw new Error('Too many requests. Please wait a moment before trying again.');
    }
    
    if (response.status === 503) {
      throw new Error(`${type.charAt(0).toUpperCase() + type.slice(1)} generation service is temporarily unavailable. Please try again later.`);
    }
    
    if (response.status === 402) {
      throw new Error('Subscription required for AI content generation. Please upgrade your account.');
    }
    
    // Try GET request if POST returns 405 (Method Not Allowed)
    if (response.status === 405) {
      const queryParams = new URLSearchParams({ prompt: requestBody.prompt }).toString();
      response = await fetch(`${apiUrl}?${queryParams}`, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json'
        }
      });
    }
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Failed to generate ${type}. Server responded with status ${response.status}: ${errorText}`);
    }

    return response;
  }

  /**
   * Parse API response
   */
  private static async parseResponse(response: Response): Promise<GenerationResponse> {
    try {
      return await response.json();
    } catch (parseError) {
      throw new Error('Invalid response format from API. Please try again.');
    }
  }

  /**
   * Extract content URL from API response
   */
  private static extractContentUrl(result: GenerationResponse, type: ContentType): string {
    // Check for API-specific error messages
    if (result.error) {
      throw new Error(result.error);
    }
    
    if (result.status === 'error') {
      throw new Error(result.message || 'API returned an error');
    }
    
    // Extract content URL with comprehensive checks
    const contentUrl = 
      result.url ||
      result.output ||
      result.data?.url ||
      result.image_url ||
      result.imageUrl ||
      result.file_url ||
      result.generated_url ||
      result.result ||
      result.link ||
      result.src ||
      result.path ||
      result.content_url ||
      result.media_url;
    
    if (!contentUrl) {
      console.error('API Response:', result);
      throw new Error(`No content URL found in API response. The ${type} may not have been generated successfully.`);
    }
    
    // Validate URL format
    try {
      new URL(contentUrl);
    } catch {
      throw new Error('Invalid content URL received from API');
    }

    return contentUrl;
  }

  /**
   * Get user-friendly error message
   */
  static getUserFriendlyError(error: Error): string {
    let errorMessage = error.message;
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage = 'Network error. Please check your internet connection and try again.';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Generation is taking longer than expected. Please try again with a simpler prompt.';
    }
    
    return errorMessage;
  }

  /**
   * Check if API endpoint is available
   */
  static async checkApiStatus(type: ContentType): Promise<boolean> {
    try {
      const response = await fetch(this.API_ENDPOINTS[type], { method: 'GET' });
      return response.ok || response.status === 405; // 405 is acceptable (method not allowed)
    } catch {
      return false;
    }
  }
}
