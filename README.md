Headquarters
============

A tiny tool to help choose a new headquarters. Evaluate possible
locations based on travel time from a list of addresses.

  * Step 1. Create a file named "locations.json" in this directory. It
should be valid JSON, containing an array of objects with the
following keys: "name", "street", "city", "state", "zip". All values
should be strings.

  * Step 2. Configure with the following environment variables:

    - GOOGLE_DIRECTIONS_API_URL (opt): defaults to
      "https://maps.googleapis.com/maps/api/directions/json"

    - GOOGLE_PUBLIC_API_KEY (req): requires access to the Directions
      API

    - MODE (opt): the mode of transportation to use for all routes;
      defaults to "transit"

  * Step 3. Run from the command line, e.g.: `npm start 221B Baker
    St. Marylebone, London NW1`
