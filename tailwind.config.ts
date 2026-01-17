import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Custom colors for our app
				'dragon-green': {
					DEFAULT: 'hsl(122, 39%, 49%)', // #4CAF50
					light: 'hsl(122, 39%, 85%)',
					dark: 'hsl(122, 39%, 28%)',
				},
				'app-orange': 'hsl(36, 100%, 50%)', // #FF9800
				'app-blue': 'hsl(207, 90%, 54%)', // #2196F3
				'app-yellow': 'hsl(54, 100%, 62%)', // #FFEB3B
				'app-purple': 'hsl(291, 64%, 42%)', // #9C27B0
				'app-teal': 'hsl(174, 100%, 29%)', // #009688
				'light-cloud': 'hsl(122, 39%, 95%)',
				'dark-cloud': 'hsl(210, 29%, 24%)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'bounce-gentle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' },
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
				'fade-in': 'fade-in 0.5s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
			},
			backgroundImage: {
				'gradient-rainbow': 'linear-gradient(90deg, #FFEB3B, #FF9800, #4CAF50, #2196F3, #9C27B0)',
			},
			fontFamily: {
				'rounded': ['"Nunito"', 'sans-serif'],
			},
			utilities: {
				'.perspective-1000': {
					perspective: '1000px',
				},
				'.transform-style-preserve-3d': {
					transformStyle: 'preserve-3d',
				},
				'.backface-hidden': {
					backfaceVisibility: 'hidden',
				},
				'.rotate-y-180': {
					transform: 'rotateY(180deg)',
				},
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
