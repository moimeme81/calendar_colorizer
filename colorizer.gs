function colorizeEventsBasedOnOrganizer() {
  // Replace with your Calendar ID
  var targetCalendarId = 'your_calendar_ID';
  var targetCalendar = CalendarApp.getCalendarById(targetCalendarId);
  
  // Check if the calendar is accessible
  if (!targetCalendar) {
    Logger.log('Target calendar not found or access denied. Check the Calendar ID and permissions.');
    return;
  }
  /*

*/
  // Define the color mapping for organizers and their specific calendars
  var colorMapping = {
    'organizer1@example.com': {
      'GROUP1@group.calendar.google.com': CalendarApp.EventColor.ORANGE, // change these to fetch the events and set the color
      'GROUP2@group.calendar.google.com': CalendarApp.EventColor.BLUE, 
      'GROUP3@group.calendar.google.com': CalendarApp.EventColor.MAUVE, 
      'GROUP4g@group.calendar.google.com': CalendarApp.EventColor.YELLOW 

    },
    'organizer2@example.com': {
      'yet_another_calendar_id@group.calendar.google.com': CalendarApp.EventColor.GREEN,
    },
    // Add more organizers and their calendars as needed
  };
  
  // Define the time range for events to be processed adjust as needed
  var now = new Date();
  var sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(now.getMonth() + 1); //tried 6 months but found it only works some of the times

  // Fetch events within the specified time range
  var events = targetCalendar.getEvents(now, sixMonthsFromNow);
  
  // Log the number of events found
  Logger.log('Number of events found: ' + events.length);
  
  // Process events in blocks of 30 to not trigger google api quota
  var blockSize = 30; // Number of events to process at a time
  for (var i = 0; i < events.length; i += blockSize) {
    var block = events.slice(i, i + blockSize); // Get the next block of events
    
    // Process each event in the block
    for (var j = 0; j < block.length; j++) {
      var event = block[j];
      var organizerEmail = event.getCreators()[0]; // Get the organizer's email
      var sourceCalendarId = event.getOriginalCalendarId(); // Get the source calendar ID
      
      // Check if the organizer and calendar ID exist in the color mapping
      if (colorMapping[organizerEmail] && colorMapping[organizerEmail][sourceCalendarId]) {
        event.setColor(colorMapping[organizerEmail][sourceCalendarId]);
        Logger.log('Event "' + event.getTitle() + '" color updated for organizer: ' + organizerEmail + ' and calendar: ' + sourceCalendarId);
      }
    }
    
    // Add a delay between blocks to avoid quota limits
    Utilities.sleep(2000); // 2-second delay between blocks
  }
}
