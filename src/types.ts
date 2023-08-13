type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

export type VideoSnippet = {
  // kind: 'youtube#video';
  // etag: 'Oq-I18J1pD-PJPCds7bRw99WBH0';
  /**
   * unique youtube id
   */
  id: 'jObOjhUkf50';
  snippet: {
    /**
     * date string
     */
    publishedAt: string;
    // channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: Thumbnail;
      medium: Thumbnail;
      high: Thumbnail;
      standard: Thumbnail;
      maxres: Thumbnail;
    };
    // channelTitle: string;
    categoryId: string;
    // "liveBroadcastContent": string
    // "defaultLanguage": string
    // "localized": {
    // 	"title": string
    // 	"description": string
    // },
    // "defaultAudioLanguage": "en"
  };
  nextPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
};
