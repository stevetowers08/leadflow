/**
 * Design System ESLint Rules
 * Automated consistency checks
 */

module.exports = {
  rules: {
    'design-system/consistent-headers': {
      create(context) {
        return {
          JSXElement(node) {
            if (node.openingElement.name.name === 'h1') {
              const className = node.openingElement.attributes
                .find(attr => attr.name.name === 'className');
              
              if (!className || !className.value.value.includes('text-xl font-semibold tracking-tight')) {
                context.report({
                  node,
                  message: 'All h1 elements must use design system heading class: text-xl font-semibold tracking-tight',
                });
              }
            }
          },
        };
      },
    },

    'design-system/use-stats-component': {
      create(context) {
        return {
          JSXElement(node) {
            // Check for hardcoded stats patterns
            const className = node.openingElement.attributes
              .find(attr => attr.name.name === 'className');
            
            if (className && className.value.value.includes('flex items-center gap-6 mb-4 text-sm')) {
              context.report({
                node,
                message: 'Use StatsBar component instead of hardcoded stats layout',
              });
            }
          },
        };
      },
    },
  },
};
