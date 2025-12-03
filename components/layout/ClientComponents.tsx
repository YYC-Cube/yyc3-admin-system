/**
 * @file 客户端组件
 * @description 包含仅在客户端执行的代码，如Analytics和Service Worker注册
 * @module layout
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-16
 * @updated 2024-10-16
 */
'use client';

import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/next';

/**
 * @description 客户端特定组件 - 仅在浏览器中渲染
 * @returns React组件
 */
export default function ClientComponents() {
  // 注册Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
          function(registration) {
            console.log('ServiceWorker registration successful');
          },
          function(err) {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      });
    }
  }, []);

  return (
    <>
      <Analytics />
    </>
  );
}