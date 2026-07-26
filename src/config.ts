// Configuration for the dashboard
// No API keys required! All data is generated locally.

export const config = {
  // Your address for display
  MY_ADDRESS: 'Alexanderplatz, Berlin 10178',

  // Your location coordinates
  MY_LAT: 52.5219,
  MY_LON: 13.4132,
  
  // Transport lines available in your area (customize these!)
  TRANSPORT_LINES: {
    subway: ['U8'],
    suburban: ['S1', 'S2', 'S25', 'S26'],
    tram: ['M1', 'M8', '12'],
    bus: ['247', 'M27'],
  },
  
  // Search radius for nearby stops (in meters) - for display only
  SEARCH_RADIUS: 300, // 300 meters
  
  // Refresh interval in milliseconds (default: 60 seconds)
  REFRESH_INTERVAL: 60000,
};
