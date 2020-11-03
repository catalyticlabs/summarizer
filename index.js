/*
 * This is a testing harness for the Catalytic action,
 * "Summarize rows with formulas". The initial portion of this
 * script reads a sample data set into a stream that then
 * emulates the way the summarize action works.
 */

/* NOTE
 * Change this to the appropriate file name if you are using
 * another file. To get your data, use the export feature on a
 * data table, save as a CSV, and drag the CSV file into
 * the repl.it sidebar.
 */
// CHANGE THIS VARIABLE TO USE A DIFFERENT CSV FILE
var csvFile = 'Events.csv';

var results = {};

var csv = require('csv-parser');
var fs = require('fs');

fs.createReadStream(csvFile)
	.pipe(csv())
	.on('data', row => {
		// CHANGE THIS FUNCTION TO POINT TO OTHER FORMULAS BELOW
		formulaUnique(row);
	})
	.on('end', () => {
		console.log(JSON.stringify(results, null, 2));
	});

function formulaCount(columns) {
	/*
 * This snippet below should be pasted into the Row formula
 * field of the Summarize rows with formulas action.
 * 
 * NOTE: You cannot use 'let' for a variable because the function
 * scope. Use var.
 */

	//---START----------------------------------------------------

	// Get or initialize the instance fields
	var summaryData = results['summary--data'] || {};
	var summaryRowCount = results['summary--row-count'] || 0;

	// Transform timestamp to date so we can pivot on the date
	var date = columns['Process start date'].split('T')[0];
	// Initialize to 0 or increment the count of the date
	summaryData[date] = (summaryData[date] || 0) + 1;

	// Store data back into the instance field
	results['summary--row-count'] = summaryRowCount + 1;
	results['summary--data'] = summaryData;

	//---STOP-----------------------------------------------------
}

/*
 * This is not used, but is just an example of how you can
 * perform a two-level pivot.
 */
function formulaStacked(columns) {
	//---START----------------------------------------------------

	// Get or initialize the instance fields
	var summaryData = results['summary--data'] || {};
	var summaryRowCount = results['summary--row-count'] || 0;

	// Transform timestamp to date so we can pivot on the date
	var date = columns['Timestamp'].split('T')[0];
	// Need to get the system
	var system = columns['System'];
	// Initialize the first key (date) if needed
	summaryData[date] = summaryData[date] || {};
	// Increment the second key (system) or initialize
	summaryData[date][system] = (summaryData[date][system] || 0) + 1;

	// Store data back into the instance field
	results['summary--row-count'] = summaryRowCount + 1;
	results['summary--data'] = summaryData;

	//---STOP-----------------------------------------------------
}

function formulaUnique(columns) {
	//---START----------------------------------------------------

	// Get or initialize the instance fields
	var summaryData = results['summary--data'] || {};
	var summaryRowCount = results['summary--row-count'] || 0;
	var summaryUniqueCount = results['summary--unique-count'] || 0;

	// Transform timestamp to date so we can pivot on the date
	var date = columns['Timestamp'].split('T')[0];

	// Check if the date already exists
	if (!(date in summaryData)) {
		// If not, initialize the dictionary value
		summaryData[date] = 0;
		// Increment the unique count counter
		summaryUniqueCount++;
	}
	// Increment the count of the date
	// Although incrementing the count is not needed, the dictionary
	// is so may as well make some use out of it!
	summaryData[date]++;

	// Store data back into the instance field
	results['summary--row-count'] = summaryRowCount + 1;
	results['summary--data'] = summaryData;
	results['summary--unique-count'] = summaryUniqueCount;

	//---STOP-----------------------------------------------------
}
