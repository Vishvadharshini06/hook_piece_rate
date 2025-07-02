# Chennai Port Authority - Hook Line Calculator

## Overview
This web application was developed for the Chennai Port Authority to streamline and automate the calculation of hook-based piece rate incentives for dock workers. It enables accurate and efficient handling of planning and prediction operations by incorporating real-time input fields and structured rate band calculations.

## Features
- **Dual Calculation Modes**: Supports both Prediction and Planning modes
- **Dynamic Input Generation**: Creates input fields based on hook count (1-4)
- **Automated Calculations**:
  - Piece rate earnings based on line data
  - Employee incentive breakdowns
  - Absentee adjustments
- **Comprehensive Reporting**:
  - Accounting summaries by hook
  - Grand totals across all hooks
- **Responsive Design**: Works on both desktop and mobile devices

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6)
- **Styling**: Custom CSS with responsive design
- **Data**: JSON for line data storage
- **Fonts**: Google Fonts (Roboto)

## Files Structure
```
chennai-port-calculator/
├── index.html          # Main application page
├── about.html          # About/description page
├── contact.html        # Contact information page
├── style.css           # Main stylesheet
├── script.js           # Main application logic
├── hookLineData.json   # Line data storage
├── cpa_logo.jpg        # Port authority logo
└── favicon.png         # Website favicon
```

## Setup Instructions
1. Clone this repository
2. Open `index.html` in a web browser
3. No server requirements - runs completely client-side
or 
Use below link to deploy project https://vishvadharshini06.github.io/hook_piece_rate/

## Usage
1. Select calculation type (Planning/Prediction)
2. Enter number of hooks (1-4)
3. Fill in the required fields for each hook
4. View calculated results and breakdowns
5. Use the employee incentive section to:
   - Track absentees
   - View role-based earnings
   - Generate accounting summaries

## Data Requirements
The application expects `hookLineData.json` to contain an array of objects with these properties for each line:
- `lineNo`: Line identifier
- `datumPerCrane`: Base measurement
- Rate bands: `101 -150%`, `151 - 200%`, `Above 200 %`
- Employee counts by role (e.g., "Winch driver per hook on board")

## Browser Support
The application is tested on modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Edge (latest)
