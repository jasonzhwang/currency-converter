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
│       └── ChartModal.test.tsx    # Chart modal window tests
├── hooks/                         # Custom hook tests
│   └── useLineChartInteraction.test.tsx  # Chart interaction hook tests
├── layout/                        # Layout tests
│   ├── Layout.test.tsx            # Global layout tests
│   └── Header.test.tsx            # Header component tests
├── pages/                         # Page tests
│   └── Home.test.tsx              # Home page tests
└── __snapshots__/                 # Jest snapshot files (auto-generated)
```

## Test Type Description

### 1. Component Tests (`components/`)

- **LineChart.test.tsx** - Verifies SVG line chart rendering, interactions (mouse hover, zoom)
- **ConversionBoard.test.tsx** - Verifies main component with currency cards rendering, editing, chart opening
- **CurrencyCard.test.tsx** - Verifies individual currency card rendering (base vs target) and callbacks
- **ChartModal.test.tsx** - Verifies modal title, zoom controls, empty data handling

### 2. Hook Tests (`hooks/`)

- **useLineChartInteraction.test.tsx** - Verifies mouse move calculations, wheel zoom triggering

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

## Notes

- Snapshot files are located in `__snapshots__/` directory, do not edit manually
- If modifying component styles or structure, update corresponding query selectors
- Some React act warnings are filtered by `jest.setup.js` in the project root (see setup file)
