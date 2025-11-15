import React from 'react';

export default function Head() {
  return (
    <>
      {/* Primary favicon files (ICO for legacy, PNGs for modern browsers) */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" href="/icon-32.png" sizes="32x32" type="image/png" />
      <link rel="icon" href="/icon-16.png" sizes="16x16" type="image/png" />
      <link rel="shortcut icon" href="/favicon.ico" />
      {/* Apple touch icon */}
      <link rel="apple-touch-icon" href="/icon-32.png" />
      {/* Fallback to the original uploaded jpeg if something else fails */}
      <link rel="alternate icon" href="/logo.jpeg" type="image/jpeg" />
    </>
  );
}
