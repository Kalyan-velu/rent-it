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
					label: 'Start Here',
					items: [
						{ label: 'Introduction', slug: '' },
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
					label: 'Technical',
					items: [
						{ label: 'Database Schema', slug: 'technical/database' },
						{ label: 'Risks & Dependencies', slug: 'technical/risks' },
					],
				},
				{
					label: 'Product',
					items: [
						{ label: 'Features Matrix', slug: 'product/features' },
						{ label: 'Budget & Costs', slug: 'product/budget' },
					],
				},
			],
		}),
	],
})
