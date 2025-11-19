# Test Structure

This project uses a layered test file organization, classified according to the logical structure of the source code.

## Directory Structure

```
src/__tests__/
├── components/                    # Component tests
│   ├── Chart/
│   │   └── LineChart.test.tsx     # Line chart component tests
│   ├── ConversionBoard/
│   │   └── ConversionBoard.test.tsx # Currency conversion main panel tests
│   ├── CurrencyCard/
│   │   └── CurrencyCard.test.tsx  # Individual currency card tests
│   └── Modals/
│       ├── ChartModal.test.tsx    # Chart modal window tests
│       └── InputModal.test.tsx    # Input modal for currency amount editing tests
├── hooks/                         # Custom hook tests
│   ├── useLineChartInteraction.test.tsx  # Chart interaction hook tests
│   └── useInputValidation.test.ts        # Input validation hook tests
├── layout/                        # Layout tests
│   ├── Layout.test.tsx            # Global layout tests
│   └── Header.test.tsx            # Header component tests
├── pages/                         # Page tests
│   └── Home.test.tsx              # Home page tests
└── __snapshots__/                 # Jest snapshot files (auto-generated)
```

## Test Type Description

### 1. Component Tests (`components/`)

- **LineChart.test.tsx** - Verifies SVG line chart rendering (polyline, gradient fill, axes, all date ticks), mouse hover interactions (tooltip display and positioning), crosshair rendering, empty state handling, single/multiple data points
- **ConversionBoard.test.tsx** - Verifies main component with currency cards rendering, editing, chart opening
- **CurrencyCard.test.tsx** - Verifies individual currency card rendering (base vs target) and callbacks
- **ChartModal.test.tsx** - Verifies modal rendering (open/closed states), currency pair title display, zoom controls (zoom in/out/reset), zoom level display, button disabled states at limits, loading state, empty data handling, close button functionality, modal overlay click behavior, LineChart integration
- **InputModal.test.tsx** - Verifies input modal rendering, number pad functionality, decimal button, delete/clear buttons, confirm/cancel actions, button disabled states

### 2. Hook Tests (`hooks/`)

- **useLineChartInteraction.test.tsx** - Verifies mouse move calculations, wheel zoom triggering, nearest data point detection
- **useInputValidation.test.ts** - Verifies number validation logic: positive numbers, decimal place limits (max 4), error message display conditions, leading/trailing decimals

### 3. Layout Tests (`layout/`)

- **Layout.test.tsx** - Verifies global layout wrapper rendering
- **Header.test.tsx** - Verifies header title and styling

### 4. Page Tests (`pages/`)

- **Home.test.tsx** - Verifies home page integration: ConversionBoard loading, currency cards rendering

## Running Tests

```bash
# Run all tests
npm test

# Run tests in a specific folder
npm test -- components/ConversionBoard

# Run a specific test file
npm test -- LineChart.test.tsx

# View coverage report
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## Testing Best Practices

1. **Async Queries** - Use `findBy*` to wait for async operations to complete
2. **Data Isolation** - Use `jest.mock()` to mock external services (exchangeRate)
3. **Queryability** - Use `data-testid` to remove query ambiguity when needed
4. **Event Simulation** - Use `fireEvent` or `userEvent` to simulate user interactions
5. **Clear Assertions** - One test per key behavior, avoid multiple assertions that confuse the test purpose

## Chart Component Testing Coverage

### LineChart Tests

- SVG rendering: polyline, gradient fill, axes
- Date tick display: shows all dates in data
- Y-axis: tick labels and grid lines
- Hover interactions: tooltip display with date and rate (4 decimal places)
- Tooltip positioning: aligns with data points
- Crosshair: appears on hover
- Empty state: displays "No data" message
- Edge cases: single data point, multiple data points

### ChartModal Tests

- Modal states: open/closed rendering
- Title: displays correct currency pair (BASE / TARGET)
- Subtitle: "Foreign Exchange rate" styling
- Zoom controls: +, -, Reset buttons
- Zoom levels: day count display (5d to 14d range)
- Button states: disabled at min/max zoom levels
- Data states: loading, empty, populated
- User interactions: close button, overlay click
- Integration: LineChart rendering within modal

## Notes

- Snapshot files are located in `__snapshots__/` directory, do not edit manually
- If modifying component styles or structure, update corresponding query selectors
- Some React act warnings are filtered by `jest.setup.js` in the project root (see setup file)
- Chart tests mock `getBoundingClientRect()` for deterministic hover position calculations
