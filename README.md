Headquarters
============

A tiny tool to help choose a new headquarters. Evaluate possible
locations based on travel time from a list of addresses.

  * Step 1. Create a file named "locations.json" in this directory. It
should be valid JSON, containing an array of objects with the
following keys: "name", "street", "city", "state", "zip". All values
should be strings.

  * Step 2. Configure with the following environment variables:

    - GOOGLE_PUBLIC_API_KEY: requires access to the Directions API

  * Step 3. Profit
