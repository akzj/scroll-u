import { cva, type VariantProps } from 'class-variance-authority';

export const scrollUVariants = cva('scroll-u-container', {
  variants: {
    variant: {
      default: 'bg-white border border-gray-200',
      primary: 'bg-blue-50 border border-blue-200',
      dark: 'bg-gray-800 border border-gray-700 text-white',
    },
    size: {
      default: 'py-1',
      sm: 'py-0.5',
      lg: 'py-2',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export const scrollUItemVariants = cva('scroll-u-item', {
  variants: {
    variant: {
      default: 'border-b border-gray-200',
      primary: 'border-b border-blue-200',
      dark: 'border-b border-gray-700',
    },
    size: {
      default: 'h-12',
      sm: 'h-10',
      lg: 'h-14',
    },
    height: {
      default: 'h-12',
      sm: 'h-10',
      lg: 'h-14',
    },
  },
});

export const scrollUButtonVariants = cva('scroll-u-btn', {
  variants: {
    variant: {
      default: 'bg-gray-100 hover:bg-gray-200',
      primary: 'bg-blue-100 hover:bg-blue-200',
      dark: 'bg-gray-700 hover:bg-gray-600',
    },
  },
});
