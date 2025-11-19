import Button from "../design-system/components/Button";
import { tokens } from "../design-system";
import Card from "../design-system/components/Card";
import Input from "../design-system/components/Input";
import styles from "../design-system/DesignSystem.module.scss";

export default function DesignSystemPage() {
  const { colors, spacing, typography, breakpoints } = tokens;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Design System</h1>
        <p>Currency Converter Design System - Components & Tokens</p>
      </header>

      {/* Colors Section */}
      <section className={styles.section}>
        <h2>Colors</h2>
        <div className={styles.colorGrid}>
          <div className={styles.colorCategory}>
            <h3>All Colors</h3>
            <div className={styles.colorList}>
              {Object.entries(colors).map(([name, value]) => (
                <div key={name} className={styles.colorCard}>
                  <div
                    className={styles.colorBox}
                    style={{ backgroundColor: value as string }}
                    title={value as string}
                  />
                  <div className={styles.colorInfo}>
                    <div className={styles.colorLabel}>{name}</div>
                    <div className={styles.colorValue}>{value as string}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Spacing Section */}
      <section className={styles.section}>
        <h2>Spacing</h2>
        <div className={styles.spacingGrid}>
          {Object.entries(spacing).map(([name, value]) => (
            <div key={name} className={styles.spacingCard}>
              <div className={styles.spacingDemo}>
                <div
                  className={styles.spacingBlock}
                  style={{ width: value as string, height: value as string }}
                />
              </div>
              <div className={styles.spacingInfo}>
                <div className={styles.spacingLabel}>{name}</div>
                <div className={styles.spacingValue}>{value as string}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Section */}
      <section className={styles.section}>
        <h2>Typography</h2>

        <div className={styles.subsection}>
          <h3>Font Sizes</h3>
          <div className={styles.typographyGrid}>
            {Object.entries(typography.fontSizes).map(([name, size]) => (
              <div key={name} className={styles.typeCard}>
                <div style={{ fontSize: size as string }} className={styles.typePreview}>
                  {name}
                </div>
                <div className={styles.typeInfo}>
                  <span>{name}</span>
                  <span>{size as string}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.subsection}>
          <h3>Font Weights</h3>
          <div className={styles.weightGrid}>
            {Object.entries(typography.fontWeights).map(([name, weight]) => (
              <div key={name} className={styles.weightCard}>
                <div style={{ fontWeight: weight as number }} className={styles.weightPreview}>
                  {name}
                </div>
                <div className={styles.weightValue}>{weight}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buttons Section */}
      <section className={styles.section}>
        <h2>Buttons</h2>

        <div className={styles.subsection}>
          <h3>Variants</h3>
          <div className={styles.buttonGrid}>
            <Button variant="secondary">Secondary</Button>
            <Button variant="primary">Primary</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </div>

        <div className={styles.subsection}>
          <h3>Sizes</h3>
          <div className={styles.buttonGrid}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        <div className={styles.subsection}>
          <h3>States</h3>
          <div className={styles.buttonGrid}>
            <Button variant="primary">Normal</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className={styles.section}>
        <h2>Cards</h2>
        <div className={styles.cardGrid}>
          <Card className={styles.paddedCard}>
            <h3>Default Card</h3>
            <p>Basic card with standard border and background.</p>
          </Card>
          <Card interactive className={styles.paddedCard}>
            <h3>Interactive Card</h3>
            <p>Hover to see the border turn blue.</p>
          </Card>
        </div>
      </section>

      {/* Inputs Section */}
      <section className={styles.section}>
        <h2>Inputs</h2>

        <div className={styles.subsection}>
          <h3>Normal Input</h3>
          <Input placeholder="Enter some text..." />
        </div>

        <div className={styles.subsection}>
          <h3>Input with Label</h3>
          <Input label="Email Address" type="email" placeholder="your@email.com" />
        </div>

        <div className={styles.subsection}>
          <h3>Input with Error</h3>
          <Input
            label="Number"
            type="number"
            placeholder="Enter number"
            error="number is invalid"
          />
        </div>
      </section>

      {/* Breakpoints Section */}
      <section className={styles.section}>
        <h2>Breakpoints</h2>
        <div className={styles.breakpointGrid}>
          {Object.entries(breakpoints).map(([name, value]) => (
            <div key={name} className={styles.breakpointCard}>
              <div className={styles.breakpointLabel}>{name}</div>
              <div className={styles.breakpointValue}>{value as string}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
