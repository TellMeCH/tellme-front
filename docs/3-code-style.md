# Code Style

## Styles

1. Tailwind utility classes should be the primary method for styling components.
2. In cases where Tailwind does not provide sufficient flexibility (e.g., complex layouts, pseudo-classes, media queries), .scss files may be used as an alternative.
3. Any SCSS file must be colocated with the component it styles, residing in the same directory.
4. SCSS styles must be imported and utilized as CSS modules using the following convention:

<!-- prettier-ignore -->
```tsx
import styles from './component.module.scss';

return <div className={styles.header} />;
```

5. Custom class names must follow the [BEM (Block-Element-Modifier)](https://en.bem.info/methodology/naming-convention) naming convention.

## Translations

All display texts must be extracted into translation files (en.json, fi.json, etc.) and structured to reflect the context and library they belong to.

### Structure

Below is an example structure.

```tsx
{                      // Context
  "DASHBOARD": {       // Library
    "STATISTICS": {    // Subcomponent of the library
    ...
    },
    "TOPIC_TRENDS": {  // Subcomponent of the library
    ...
    },
    ...
  },
  "ANALYSIS": {        // Library
    "SELECT": {        // Subcomponent of the library
    ...
    },
   ...
  },
...
}

```

### Key Naming Convention

Translation keys must be written in UPPER_SNAKE_CASE format. Keys should begin with a prefix that indicates the type of element being translated.

| Element Type | Example Key     |
| ------------ | --------------- |
| Link         | `LINK_LOGIN`    |
| Button       | `BUTTON_SUBMIT` |
| Static Text  | `TEXT_TITLE`    |
