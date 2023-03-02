// Run node data_manipulation.js to get the expected result


// Sample API Response
const response = [
  {
    id: 1293487,
    name: "KCRW",  // radio station callsign
    tracks: [{ timestp: "2021-04-08", trackName: "Peaches" }]
  },
  {
    id: 12923,
    name: "KQED",
    tracks: [
      { timestp: "2021-04-09", trackName: "Savage" },
      { timestp: "2021-04-09", trackName: "Savage (feat. Beyonce)" },
      { timestp: "2021-04-08", trackName: "Savage" },
      { timestp: "2021-04-08", trackName: "Savage" },
      { timestp: "2021-04-08", trackName: "Savage" }
    ]
  },
  {
    id: 4,
    name: "WNYC",
    tracks: [
      { timestp: "2021-04-09", trackName: "Captain Hook" },
      { timestp: "2021-04-08", trackName: "Captain Hook" },
      { timestp: "2021-04-07", trackName: "Captain Hook" }
    ]
  }
];


// Data manipulation function
function processAPIResponse(apiResponse) {
  const tracksByDate = {};

  apiResponse.forEach(station => {
    station.tracks.forEach(track => {
      const { timestp, trackName } = track;
      const trackDate = tracksByDate[timestp] || {};

      trackDate[trackName] = (trackDate[trackName] || 0) + 1;
      tracksByDate[timestp] = trackDate;
    });
  });

  return Object.entries(tracksByDate).sort().map(([date, tracks]) => ({
    x: date,
    y: Object.values(tracks).reduce((sum, count) => sum + count, 0),
    tooltip: constructTooltip(tracks),
  }));
}

function constructTooltip(tracks) {
  return Object.entries(tracks).map(([name, count]) => `${name} (${count})`).join(", ");
}

const data = processAPIResponse(response);
console.log(data);