
const db = require('./database');

const templates = [
  {
    title: 'SaaS Dashboard UI',
    description: 'A clean dashboard layout for modern SaaS applications.',
    category: 'Dashboard',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    author: 'TemplateHub',
  },
  {
    title: 'Creative Portfolio',
    description: 'Showcase your projects with a stylish portfolio design.',
    category: 'Portfolio',
    image_url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800',
    author: 'TemplateHub',
  },
  {
    title: 'Modern Landing Page',
    description: 'A bold landing page for launching your next big idea.',
    category: 'Landing Page',
    image_url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
    author: 'TemplateHub',
  },
  {
    title: 'Online Storefront',
    description: 'A polished storefront layout for online businesses.',
    category: 'E-commerce',
    image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    author: 'TemplateHub',
  },
  {
    title: 'Analytics Overview',
    description: 'Present important metrics in a clear visual dashboard.',
    category: 'Dashboard',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    author: 'TemplateHub',
  },
];

async function seed() {
  try {
    const existing = await db('templates').count({ count: '*' }).first();

    if (Number(existing.count) === 0) {
      await db('templates').insert(templates);
      console.log('✅ Five sample templates added successfully!');
    } else {
      console.log('ℹ️ Templates already exist. No duplicates added.');
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await db.destroy();
  }
}

seed();