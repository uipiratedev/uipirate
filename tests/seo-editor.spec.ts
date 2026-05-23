import { test, expect } from '@playwright/test';

test.describe('Admin SEO Editor', () => {
  test.beforeEach(async ({ page }) => {
    // Login logic would go here
    await page.goto('/admin/login');
    // ... login steps ...
  });

  test('should open SEO editor and run AI analysis', async ({ page }) => {
    await page.goto('/admin/posts/create');
    
    // Enter some content
    await page.fill('input[placeholder="Post title…"]', 'My SEO Optimized Post');
    
    // Open SEO Modal
    await page.click('button:has-text("Open SEO Editor")');
    await expect(page.locator('h2:has-text("Search Optimization")')).toBeVisible();
    
    // Run AI Analysis
    await page.click('button:has-text("Auto-Optimize with AI")');
    
    // Check if AI filled some fields (mocking or waiting for real API)
    // In a real test, we might mock the /api/ai/generate endpoint
    
    // Check SERP Preview
    await expect(page.locator('h3:has-text("My SEO Optimized Post")')).toBeVisible();
    
    // Apply changes
    await page.click('button:has-text("Apply Changes")');
    await expect(page.locator('h2:has-text("Search Optimization")')).not.toBeVisible();
  });

  test('should validate meta tag character limits', async ({ page }) => {
    await page.goto('/admin/posts/create');
    await page.click('button:has-text("Open SEO Editor")');
    
    const longTitle = 'A'.repeat(70);
    await page.fill('input[placeholder="Enter search engine title..."]', longTitle);
    
    // Check for red color or warning text (assuming it turns red as per UI code)
    const counter = page.locator('span:has-text("/60")');
    await expect(counter).toHaveClass(/text-red-500/);
  });
});
