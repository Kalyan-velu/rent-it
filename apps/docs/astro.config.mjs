// @ts-check
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Rent-a-Wheel Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/Kalyan-velu/get-a-car' }],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: '' },
						{ label: 'Quick Start', slug: 'guides/getting-started' },
					],
				},
				{
					label: 'Technical',
					items: [
						{ label: 'Architecture Overview', slug: 'technical/architecture' },
						{ label: 'Database Schema', slug: 'technical/database' },
						{ label: 'Authentication', slug: 'technical/auth' },
						{ label: 'API Reference', slug: 'technical/api' },
						{ label: 'Risks & Dependencies', slug: 'technical/risks' },
					],
				},
				{
					label: 'Planning',
					items: [
						{ label: 'Sprint Plan', slug: 'planning/sprint-plan' },
						{ label: 'Progress Tracker', slug: 'planning/progress' },
						{ label: 'Estimation Guide', slug: 'planning/estimation' },
					],
				},
				{
					label: 'Product',
					items: [
						{ label: 'Features Matrix', slug: 'product/features' },
						{ label: 'Budget & Costs', slug: 'product/budget' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Project Specification', slug: 'reference/project_spec' },
					],
				},
			],
		}),
	],
})
